var express = require('express');
var sc = require('../../controller/signup');
var router = express.Router();
router.post('/', function(req, res, next) {
    try {
        switch(req.query.action) {
            case 'check':
                sc.check(req, res, next);
            break;
            case 'reg':
                sc.register(req, res, next);
            break;
            default:
                res.status(400).json({ message: 'Invalid query parameter: action - ' + req.query.action});
            break;
        }
    }
    catch(e) {
        res.status(500).json({ message: 'Unexpected failure. Please report to support - ' + e});
    }
});
module.exports = router;