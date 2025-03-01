const { Op,DataTypes } = require('sequelize');
let db = require('../../db');
let User = require('../../db/user');
let Tree = require('../../db/tree');
let Person = require('../../db/person');
let Membership = require('../../db/membership');
let IDGen = require('../../db/id_gen');
let util = require('../../common/util');
let codes = require('../../common/codes');
let store = db.getInstance();
class SignupHelper {
    getNodeJSON(id) {
        return {person:{id:id},spouses:[],children:[],pets:[]};
    }
    onFailure(e, res, t) {
        t.rollback().then(()=>{
            const c = codes.get('unexpected_failure');
            if(e.errors?.length > 0) {
                res.status(500).json({code:c.code,message:c.message + e.errors[0].message});
            }
            else {
                res.status(500).json({code:c.code,message:c.message + e});
            }
        });
    }
    registerNew(req, res) {
        let allIDs = [];
        let self = this;
        let trn, rec1, rec2, rec3, rec4;
        let username = util.isFilled(req.body.person.phone) ? req.body.person.phone : req.body.person.email;
        store.transaction().then((t)=>{
            trn = t;
            return IDGen.bulkCreate([{entity:'user'},{entity:'tree'},{entity:'person'},{entity:'membership'}],{transaction: t});
        }).then((ids)=>{
            allIDs = ids;
            const userData = {
                name: util.trim(req.body.person.givenName) + (util.isFilled(req.body.person.surname) ? ' ' : '') + util.trim(req.body.person.surname),
                username: username,
                status: 'Active',
                created_by_id: ids[0].id,
                modified_by_id: ids[0].id,
                id: ids[0].id,
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
                birth_date: (util.isFilled(req.body.person.birthDate) ? new Date(req.body.person.birthDate) : null),
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
                sub_tree_json: self.getNodeJSON(allIDs[2].id)
            }
            return Person.create(personData, {transaction: trn});
        }).then((r)=>{
            rec3 = r;
            const membershipData = {
                person_id: allIDs[2].id,
                status: 'Active',
                tree_id: allIDs[1].id,
                invited_by_person_id: allIDs[2].id,
                type: 'Owner',
                created_by_id: allIDs[0].id,
                modified_by_id: allIDs[0].id,
                id: allIDs[3].id,
            }
            return Membership.create(membershipData, {transaction: trn});
        }).then((r3)=>{
            return trn.commit();
        }).then(()=>{
            res.json({...codes.get('signup_success')});
        }).catch((e)=>{
            this.onFailure(e, res, trn);
        });
    }
    registerExisting(req, res) {
        let trn;
        let allIDs = [];
        let personId = req.body.person.id;
        let username = util.isFilled(req.body.person.phone) ? req.body.person.phone : req.body.person.email;
        store.transaction().then((t)=>{
            trn = t;
            return IDGen.bulkCreate([{entity:'user'}],{transaction: t});
        }).then((ids)=>{
            allIDs = ids;
            const userData = {
                name: util.trim(req.body.person.givenName) + (util.isFilled(req.body.person.surname) ? ' ' : '') + util.trim(req.body.person.surname),
                username: username,
                status: 'Active',
                created_by_id: ids[0].id,
                modified_by_id: ids[0].id,
                id: ids[0].id,
            }
            return User.create(userData, {transaction: trn});
        }).then((r)=>{
            const filter = {
                attributes: ['id','tree_id','given_name','surname','nicknames','email','phone','birth_date','gender','lives_in','bio'],
                where: [{id:personId}],
            }
            return Person.findAll(filter);
        }).then((r)=>{
            const personData = {
                user_id:allIDs[0].id,
                given_name: req.body.person.givenName,
                surname: util.isFilled(req.body.person.surname) ? req.body.person.surname : r[0].surname,
                nicknames: util.isFilled(req.body.person.nicknames) ? req.body.person.nicknames : r[0].nicknames,
                birth_date: (util.isFilled(req.body.person.birthDate) ? new Date(req.body.person.birthDate) : r[0].birth_date),
                lives_in: (util.isFilled(req.body.person.livesIn) ? req.body.person.livesIn : r[0].lives_in),
                phone: (util.isFilled(req.body.person.phone) ? req.body.person.phone : r[0].phone),
                email: (util.isFilled(req.body.person.email) ? req.body.person.email : r[0].email),
                gender: (util.isFilled(req.body.person.gender) ? req.body.person.gender : r[0].gender),
                bio: (util.isFilled(req.body.person.bio) ? req.body.person.bio : r[0].bio),
                modified_by_id: allIDs[0].id,
            };
            return Person.update(personData,{where:{id:personId},transaction: trn});
        }).then((r)=>{
            return Membership.update({status:'Active'},{where:{[Op.and]:{person_id:personId,status:'Invited'}},transaction: trn});
        }).then((r)=>{
            return trn.commit();
        }).then(()=>{
            res.json({...codes.get('signup_success')});
        }).catch((e)=>{
            this.onFailure(e, res, trn);
        });
    }
}
module.exports = new SignupHelper();