var express = require('express');
var signup = require('../../controller/signup');
var router = express.Router();
router.post('/', function(req, res, next) {
    signup(req, res, next);
});
module.exports = router;