const { Op,DataTypes } = require('sequelize');
let db = require('../../db');
let User = require('../../db/user');
let Tree = require('../../db/tree');
let Person = require('../../db/person');
let Membership = require('../../db/Membership');
Membership.belongsTo(Person, {foreignKey: "person_id"});
let IDGen = require('../../db/id_gen');
let util = require('../../common/util');
let store = db.getInstance();
class SignupHelper {
    onFailure(e, res, t, sCode) {
        t.rollback().then(()=>{
            let msg = e.errors?.length > 0 ? e.errors[0].message : 'Unexpected failure. Contact support - ' + e;
            if(sCode == undefined) {
                res.status(500).json({message: msg});
            }
            else {
                res.status(sCode).json({message: msg});
            }
        });
    }
    registerNew(uname, req, res) {
        let allIDs = [];
        let trn, rec1, rec2, rec3;
        store.transaction().then((t)=>{
            trn = t;
            return IDGen.bulkCreate([{entity:'user'},{entity:'tree'},{entity:'person'}],{transaction: t});
        }).then((ids)=>{
            allIDs = ids;
            const userData = {
                username:uname,
                status:'active',
                created_by_id:ids[0].id,
                modified_by_id:ids[0].id,
                id:ids[0].id,
            }
            return User.create(userData, {transaction: trn});
        }).then((r1)=>{
            rec1 = r1;
            const treeData = {
                created_by_id: allIDs[0].id,
                modified_by_id: allIDs[0].id,
                id: allIDs[1].id,
            }
            return Tree.create(treeData, {transaction: trn});
        }).then((r2)=>{
            rec2 = r2;
            const personData = {
                given_name: req.body.person.givenName,
                surname: req.body.person.surname,
                nicknames:req.body.person.nickNames,
                birth_date: new Date(req.body.person.birthDate),
                lives_in: req.body.person.livesIn,
                phone: req.body.person.phone,
                email: req.body.person.email,
                gender: req.body.person.gender,
                bio: req.body.person.biography?.content,
                created_by_id: allIDs[0].id,
                modified_by_id: allIDs[0].id,
                user_id: allIDs[0].id,
                tree_id: allIDs[1].id,
                id: allIDs[2].id,
            }
            return Person.create(personData, {transaction: trn});
        }).then((r3)=>{
            rec3 = r3;
            return trn.commit();
        }).then(()=>{
            res.json({ message: 'Signup complete',ids:ids,user:rec1,person:rec3,tree:rec2});
        }).catch((e)=>{
            if(e.name == 'SequelizeUniqueConstraintError') {
                this.onFailure(e, res, trn, 400);
            }
            else {
                this.onFailure(e, res, trn);
            }
        });
    }
    registerExisting(uname, req, res) {
        let trn, rec1;
        let allIDs = [];
        let personId = req.body.person.id;
        store.transaction().then((t)=>{
            trn = t;
            return IDGen.bulkCreate([{entity:'user'}],{transaction: t});
        }).then((ids)=>{
            allIDs = ids;
            const userData = {
                username:uname,
                status:'active',
                created_by_id:ids[0].id,
                modified_by_id:ids[0].id,
                id:ids[0].id,
            }
            return User.create(userData, {transaction: trn});
        }).then((r1)=>{
            rec1 = r1;
            return trn.commit();
        }).then(()=>{
            Person = store.define('person', {
                    user_id: {
                        type: DataTypes.STRING(12),
                    },
                },{
                    schema: 'fbfs',
                    timestamps: false,
                    freezeTableName: true,
                }
            );
            return Person.update({user_id:ids[0].id},{where:{id:personId}});
        }).then(()=>{
            res.json({ message: 'Signup complete',ids:allIDs,user:rec1});
        }).catch((e)=>{
            if(e.name == 'SequelizeUniqueConstraintError') {
                this.onFailure(e, res, trn, 400);
            }
            else {
                this.onFailure(e, res, trn);
            }
        });
    }
}
module.exports = new SignupHelper();