var express = require('express');
var router = express.Router({'mergeParams':true});
router.get('/', function(req, res, next) {
    res.json({ message: 'Welcome to Comments - eid: ' + req.query.eid + ',tid: ' + req.params.tid });
});
module.exports = router;
