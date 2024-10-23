const { Op } = require('sequelize');
let db = require('../../db');
let User = require('../../db/user');
let Tree = require('../../db/tree');
let Person = require('../../db/person');
let Membership = require('../../db/Membership');
let IDGen = require('../../db/id_gen');
let util = require('../../common/util');
let codes = require('../../common/codes');
let helper = require('./helper.js');
let store = db.getInstance();
class SignupController {
    isInputValid(req, res,action) {
        if(req.body == undefined || req.body.person == undefined) {
            res.status(400).json({...codes.invalid_input_person_missing});
            return false;
        }
        let uname = util.isFilled(req.body.person.phone) ? req.body.person.phone : req.body.person.email;
        switch(action) {
            case 'check':
                if(!util.isFilled(uname)) {
                    res.status(400).json({...codes.invalid_input_req_fields_missing3});
                    return false;
                }
                break;
            case 'reg':
            default:
                if(!util.isFilled(uname) || !util.isFilled(req.body.givenName) || !util.isFilled(req.body.gender)) {
                    res.status(400).json({...codes.invalid_input_req_fields_missing1});
                    return false;
                }
                if((util.isFilled(req.body.id) && !util.isFilled(treeId)) || (!util.isFilled(req.body.id) && util.isFilled(treeId))) {
                    res.status(400).json({...codes.invalid_input_req_fields_missing2});
                    return false;
                }
                break;
        }
        return true;
    }
    check(req, res, next) {
        if(this.isInputValid(req, res, 'check')) {
            let invite, memCnt;
            let uname = util.isFilled(req.body.person.phone) ? req.body.person.phone : req.body.person.email;
            let nFilter = util.isFilled(req.body.person.phone) ? {phone:req.body.person.phone} : {email:req.body.person.email};
            User.findAll({where: {username: uname}}).then((r)=>{
                if(r.length == 0) {
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
                else {
                    res.json({...codes.dupe_user});
                }
            }).then((r)=>{
                if(r != undefined) {
                    if(r.length > 0) {
                        invite = r;
                        return Person.count({where: {tree_id:r[0].tree_id}});
                    }
                    else {
                        res.json({...codes.dupe_user_chk_pass});
                    }
                }
            }).then((r)=>{
                if(r != undefined) {
                    memCnt = r;
                    let filter3 = {
                        attributes:["id","full_name","given_name"],
                        where: {user_id:invite[0].tree.created_by_id}
                    }
                    return Person.findAll(filter3);
                }
            }).then((r)=>{
                if(r != undefined) {
                    res.json({
                        ...codes.dupe_user_chk_pass_with_invite,
                        payload: {
                            personId: invite[0].id,
                            mediaURI: util.ifNotFilled(invite[0].inviter.media_uri, undefined),
                            treeId: invite[0].tree_id,
                            invitedBy: invite[0].inviter.full_name,
                            treeName: invite[0].tree.id,
                            noOfMembers: memCnt,
                            treeCreatedBy: r[0].given_name,
                        }
                    });
                }
            }).catch((e)=>{
                res.json({code:codes.unexpected_failure.code,message:codes.unexpected_failure.message + e});
            });
        }
    }
    register(req, res, next) {
        if(this.isInputValid(req, res, 'reg')) {
            let uname = util.isFilled(req.body.person.phone) ? req.body.person.phone : req.body.person.email;
            if(util.isFilled(req.body.person.id) && util.isFilled(req.body.person.tree_id)) {
                helper.registerExisting(uname, req, res);
            }
            else {
                helper.registerNew(uname, req, res);
            }
        }
    }
}
module.exports = new SignupController();