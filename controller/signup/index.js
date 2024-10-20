const { Op } = require('sequelize');
let db = require('../../db');
let User = require('../../db/user');
let Tree = require('../../db/tree');
let Person = require('../../db/person');
let Membership = require('../../db/Membership');
Membership.belongsTo(Person, {foreignKey: "person_id"});
let IDGen = require('../../db/id_gen');
let util = require('../../common/util');
let store = db.getInstance();
const { SequelizeUniqueConstraintError } = require('sequelize');
class SignupController {
    constructor() {}
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
                    if(!util.isFilled(req.body.person.email)) {
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
                    Membership.findAll(filter).then((recs2)=>{
                        if(recs2.length > 0) {
                            res.json({
                                message: 'check complete. Did not find user1',
                                person_id:recs2[0].person_id,
                                tree_id:recs2[0].tree_id
                            });
                        }
                        else {
                            res.json({message: 'check complete. Did not find user2'});
                        }
                    }).catch((e)=>{
                        res.json({message: 'Unexpected failure. Contact support - ' + e});
                    });
                }
                else {
                    res.json({message: 'check complete. Found user'});
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
            store.transaction().then((t)=>{
                IDGen.bulkCreate([{entity:'user'},{entity:'tree'},{entity:'person'}],{transaction: t}).then((ids)=>{
                    const userData = {
                        username:uname,
                        status:'active',
                        created_by_id:ids[0].id,
                        modified_by_id:ids[0].id,
                        id:ids[0].id,
                    }
                    User.create(userData, {transaction: t}).then((rec1)=>{
                        const treeData = {
                            created_by_id: ids[0].id,
                            modified_by_id: ids[0].id,
                            id: ids[1].id,
                        }
                        Tree.create(treeData, {transaction: t}).then((rec2)=>{
                            const personData = {
                                given_name: req.body.person.givenName,
                                surname: req.body.person.surame,
                                nicknames:req.body.person.nicknames,
                                birth_date: new Date(req.body.person.birthDate),
                                lives_in: req.body.person.livesIn,
                                phone: req.body.person.phone,
                                email: req.body.person.email,
                                gender: req.body.person.gender,
                                bio: req.body.person.biography?.content,
                                created_by_id: ids[0].id,
                                modified_by_id: ids[0].id,
                                user_id: ids[0].id,
                                tree_id: ids[1].id,
                                id: ids[2].id,
                            }
                            Person.create(personData, {transaction: t}).then((rec3)=>{
                                t.commit().then(()=>{
                                    res.json({ message: 'Signup complete',ids:ids,user:rec1,person:rec3,tree:rec2});
                                }).catch((e)=>{
                                    this.onFailure(e, res, t);
                                });
                            }).catch((e)=>{
                                this.onFailure(e, res, t);
                            });
                        }).catch((e)=>{
                            this.onFailure(e, res, t);
                        });
                    }).catch((e)=>{
                        if(e.name == 'SequelizeUniqueConstraintError') {
                            this.onFailure(e, res, t, 400);
                        }
                        else {
                            this.onFailure(e, res, t);
                        }
                    });
                }).catch((e)=>{
                    this.onFailure(e, res, t);
                });
            }).catch((e)=>{
                res.status(500).json({message: 'Signup failed - ' + e});
            });
        }
    }
}
module.exports = new SignupController();