var express = require('express');
var id_gen = require('../../db/id_gen');
var router = express.Router();
router.get('/', function(req, res, next) {
    res.json({ message: 'Welcome to Trees!' });
});
router.get('/:tid', function(req, res, next) {
    id_gen.findAll().then((ids)=>{
        res.json({ message: 'Welcome to Tree2: ' + req.params.tid,ids:ids});
    });
});
module.exports = router;