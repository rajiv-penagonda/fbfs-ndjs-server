var id_gen = require('../../db/id_gen');
module.exports = function(req, res, next) {
    id_gen.bulkCreate([{entity:'user'},{entity:'tree'},{entity:'person'}]).then((ids)=>{
        res.json({ message: 'Signup complete - ' + req.params.tid,ids:ids});
    }).catch((error)=>{
        res.status(500).json({ message: 'Signup failed - ' + error});
    });
}