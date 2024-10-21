const { Op } = require('sequelize');
let db = require('../../db');
let User = require('../../db/user');
let Tree = require('../../db/tree');
let Person = require('../../db/person');
let Membership = require('../../db/Membership');
Membership.belongsTo(Person, {foreignKey: "person_id"});
let IDGen = require('../../db/id_gen');
let util = require('../../common/util');
let helper = require('./helper.js');
let store = db.getInstance();
class SignupController {
    isInputValid(req, res) {
        if(req.body == undefined || req.body.person == undefined) {
            res.status(400).json({ message: 'Invalid input. Person information not supplied.'});
            return false;
        }
        let uname = util.isFilled(req.body.person.phone) ? req.body.person.phone : req.body.person.email;
        if(!util.isFilled(uname)) {
            res.status(400).json({ message: 'Invalid input. phone/email information is not supplied.'});
            return false;
        }
        return true;
    }
    check(req, res, next) {
        if(this.isInputValid(req, res)) {
            let uname = util.isFilled(req.body.person.phone) ? req.body.person.phone : req.body.person.email;
            let filter = {
                where: {
                    username: {[Op.eq]:uname},
                }
            }
            User.findAll(filter).then((recs1)=>{
                if(recs1.length == 0) {
                    if(util.isFilled(req.body.person.email)) {
                        filter = {
                            where: {
                                '$membership.status$': { [Op.eq]: 'Invited' },
                            },
                            include: {
                                model: Person,
                                where: {
                                    email: {
                                        [Op.eq]:req.body.person.email,
                                    }
                                }
                            }
                        }
                    }
                    else {
                        filter = {
                            where: {
                                '$membership.status$': { [Op.eq]: 'Invited' },
                            },
                            include: {
                                model: Person,
                                where: {
                                    phone: {
                                        [Op.eq]:req.body.person.phone,
                                    }
                                }
                            }
                        }
                    }
                    return Membership.findAll(filter);
                }
                else {
                    res.json({message: 'check complete. Found user'});
                }
            }).then((recs2)=>{
                if(recs2.length > 0) {
                    res.json({
                        message: 'Check complete. Found an open invite but no user record.',
                        person_id:recs2[0].person_id,
                        tree_id:recs2[0].tree_id
                    });
                }
                else {
                    res.json({message: 'check complete. Did not find user'});
                }
            }).catch((e)=>{
                res.json({message: 'Unexpected failure. Contact support - ' + e});
            });
        }
    }
    onFailure(e, res, t, sCode) {
        t.rollback().then(()=>{
            let msg = e.errors?.length > 0 ? e.errors[0].message : 'Unexpected failure. Contact support';
            if(sCode == undefined) {
                res.status(500).json({message: msg});
            }
            else {
                res.status(sCode).json({message: msg});
            }
        });
    }
    register(req, res, next) {
        if(this.isInputValid(req, res)) {
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