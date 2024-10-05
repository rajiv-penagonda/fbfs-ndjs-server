var express = require('express');
var router = express.Router({'mergeParams':true});
router.get('/', function(req, res, next) {
    res.json({ message: 'Welcome to Moments!' });
});
module.exports = router;
