var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
    res.json({ message: 'Welcome to Trees!' });
});
router.get('/:tid', function(req, res, next) {
    res.json({ message: 'Welcome to Tree: ' + req.params.tid});
});
module.exports = router;
