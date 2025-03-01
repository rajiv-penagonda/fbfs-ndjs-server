const { Op } = require('sequelize');
const cc = require('../../controller/code');
const db = require('../../db');
const User = require('../../db/user');
const Code = require('../../db/code');
const Tree = require('../../db/tree');
const Person = require('../../db/person');
const Membership = require('../../db/membership');
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
                if(!util.isFilled(req.body.person.givenName) || !util.isFilled(req.body.person.gender)) {
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
            let nFilter = util.isFilled(req.body.person.phone) ? {'$person.phone$':req.body.person.phone} : {'$person.email$':req.body.person.email};
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
                        attributes: ['id','tree_id','person_id'],
                        where: [{'$membership.status$':'Invited'},nFilter],
                        include: [
                            {association:"person",attributes:['id','full_name','media_uri','email'],required: true},
                            {association:"inviter",attributes:['id','full_name','media_uri'],required: true},
                            {association:"tree",attributes:['id','created_by_id'],required: true},
                            {association:"creator",attributes:['name'],required: true}
                        ]
                    }
                    return Membership.findAll(filter1);
                }
            }).then((r)=>{
                if(r != undefined) {
                    if(r.length > 0) {
                        invite = r;
                        payload = {
                            ...payload,
                            personId: r[0].person.id,
                            mediaURI: util.ifNotFilled(r[0].inviter.media_uri, undefined),
                            treeId: r[0].tree_id,
                            invitedBy: r[0].inviter.full_name,
                            treeName: r[0].tree.id,
                            treeCreatedBy: r[0].creator.name,
                        }
                        return Person.count({where: {tree_id:r[0].tree_id}});
                    }
                    else {
                        res.json({...codes.get('dupe_user_chk_pass'),payload:{...payload}});
                    }
                }
            }).then((r)=>{
                if(r != undefined) {
                    res.json({
                        ...codes.get('dupe_user_chk_pass_with_invite'),
                        payload: {
                            ...payload,
                            verificationCode: code,
                            noOfMembers: r,
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