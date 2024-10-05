var express = require('express');
var router = express.Router({'mergeParams':true});
router.get('/', function(req, res, next) {
    res.json({ message: 'Welcome to Albums - aid:' + req.query.aid + ',tid: ' + req.params.tid });
});
module.exports = router;
