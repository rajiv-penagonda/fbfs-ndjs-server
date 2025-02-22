var express = require('express');
var router = express.Router();
let c = require('../../controller/nodes');
router.get('/:pid', function(req, res, next) {
    c.getFocusedNode(req,res,next);
});
module.exports = router;