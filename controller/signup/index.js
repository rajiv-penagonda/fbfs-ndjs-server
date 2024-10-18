let db = require('../../db');
let user = require('../../db/user');
let tree = require('../../db/tree');
let person = require('../../db/person');
let id_gen = require('../../db/id_gen');
let store = db.getInstance();
module.exports = function(req, res, next) {
    if(req.body == undefined || req.body.person == undefined) {
        res.status(400).json({ message: 'Invalid input. Person information not supplied.'});
    }
    else {
        store.transaction().then((t)=>{
            id_gen.bulkCreate([{entity:'user'},{entity:'tree'},{entity:'person'}],{transaction: t}).then((ids)=>{
                const userData = {
                    membership_type:'super',
                    status:'active',
                    created_by_id:ids[0].id,
                    modified_by_id:ids[0].id,
                    id:ids[0].id,
                }
                user.create(userData, {transaction: t}).then((rec1)=>{
                    const treeData = {
                        created_by_id: ids[0].id,
                        modified_by_id: ids[0].id,
                        id: ids[1].id,
                    }
                    tree.create(treeData, {transaction: t}).then((rec2)=>{
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
                        person.create(personData, {transaction: t}).then((rec3)=>{
                            res.json({ message: 'Signup complete',ids:ids,user:rec1,person:rec3,tree:rec2});
                        }).catch((e)=>{
                            res.status(500).json({ message: 'Signup failed - ' + e});
                        });
                    }).catch((e)=>{
                        res.status(500).json({ message: 'Signup failed - ' + e});
                    });
                }).catch((e)=>{
                    res.status(500).json({ message: 'Signup failed - ' + e});
                });
            }).catch((e)=>{
                res.status(500).json({ message: 'Signup failed - ' + e});
            });
        }).catch((e)=>{
            res.status(500).json({ message: 'Signup failed - ' + e});
        });
    }
}