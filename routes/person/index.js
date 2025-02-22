var express = require('express');
var router = express.Router({'mergeParams':true});
router.get('/', function(req, res, next) {
    res.json({ message: 'Welcome to Person! GET' });
});
router.post('/', function(req, res, next) {
    res.json({ message: 'Welcome to Person! POST' });
});
module.exports = router;
