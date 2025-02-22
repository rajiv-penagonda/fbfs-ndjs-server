const { Op } = require('sequelize');
const cc = require('../../controller/code');
const ac = require('../../controller/auth');
const db = require('../../db');
const User = require('../../db/user');
const Code = require('../../db/code');
const Tree = require('../../db/tree');
const Person = require('../../db/person');
const Membership = require('../../db/Membership');
const IDGen = require('../../db/id_gen');
const util = require('../../common/util');
const codes = require('../../common/codes');
const helper = require('./helper.js');
const store = db.getInstance();
class SignupController {
    isInputValid(req, res,action) {
        if(req.body == undefined || req.body.person == undefined) {
            res.status(400).json({...codes.get('invalid_input_person_missing')});
            return false;
        }
        switch(action) {
            case 'check':
                let uname = util.isFilled(req.body.person.phone) ? req.body.person.phone : req.body.person.email;
                if(!util.isFilled(uname)) {
                    res.status(400).json({...codes.get('invalid_input_req_fields_missing3')});
                    return false;
                }
                break;
            case 'register':
            default:
                const creds = ac.getCreds(req);
                if(creds.code != '100') {
                    res.status(400).json(creds);
                    return false;
                }
                else if(!util.isFilled(req.body.person.givenName) || !util.isFilled(req.body.person.gender)) {
                    res.status(400).json({...codes.get('invalid_input_req_fields_missing1')});
                    return false;
                }
                break;
        }
        return true;
    }
    check(req, res, next) {
        if(this.isInputValid(req, res, 'check')) {
            let invite;
            let payload = {};
            const code = cc.generateCode();
            let uname = util.isFilled(req.body.person.phone) ? req.body.person.phone : req.body.person.email;
            let nFilter = util.isFilled(req.body.person.phone) ? {phone:req.body.person.phone} : {email:req.body.person.email};
            User.findAll({where: {username: uname}}).then((r)=>{
                if(r.length == 0) {
                    return Code.upsert({username:uname,code:code});
                }
                else {
                    res.json({...codes.get('dupe_user')});
                }
            }).then((r)=>{
                if(r != undefined) {
                    payload = {
                        verificationCode: code
                    }
                    let filter1 = {
                        attributes: ['id','tree_id'],
                        where: [{'$person.membership_status$':'Invited'},nFilter],
                        include: [
                            {association:"inviter",attributes:['full_name','media_uri'],required: true},
                            {association:"tree",attributes:['id','created_by_id'],required: true}
                        ]
                    }
                    return Person.findAll(filter1);
                }
            }).then((r)=>{
                if(r != undefined) {
                    if(r.length > 0) {
                        invite = r;
                        payload = {
                            ...payload,
                            personId: r[0].id,
                            mediaURI: util.ifNotFilled(r[0].inviter.media_uri, undefined),
                            treeId: r[0].tree_id,
                            invitedBy: r[0].inviter.full_name,
                            treeName: r[0].tree.id,
                        }
                        return Person.count({where: {tree_id:r[0].tree_id}});
                    }
                    else {
                        res.json({...codes.get('dupe_user_chk_pass'),payload:{...payload}});
                    }
                }
            }).then((r)=>{
                if(r != undefined) {
                    payload = {
                        ...payload,
                        noOfMembers: r,
                    }
                    let filter3 = {
                        attributes:["id","full_name"],
                        where: {user_id:invite[0].tree.created_by_id}
                    }
                    return Person.findAll(filter3);
                }
            }).then((r)=>{
                if(r != undefined) {
                    res.json({
                        ...codes.get('dupe_user_chk_pass_with_invite'),
                        payload: {
                            ...payload,
                            treeCreatedBy: r[0].full_name,
                            verificationCode: code
                        }
                    });
                }
            }).catch((e)=>{
                const c = codes.get('unexpected_failure');
                res.json({code:c.code,message:c.message + e});
            });
        }
    }
    register(req, res, next) {
        if(this.isInputValid(req, res, 'register')) {
            if(util.isFilled(req.body.person.id)) {
                helper.registerExisting(req, res);
            }
            else {
                helper.registerNew(req, res);
            }
        }
    }
}
module.exports = new SignupController();