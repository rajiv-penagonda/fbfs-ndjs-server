var express = require('express');
var cc = require('../../controller/code');
let codes = require('../../common/codes');
var router = express.Router();
router.post('/', function(req, res, next) {
    try {
        switch(req.query.action) {
            case 'generate':
                cc.sendVerificationCode(req,res);
            break;
            case 'verify':
                cc.verifyCode(req,res);
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