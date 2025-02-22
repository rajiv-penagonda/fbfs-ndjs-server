let db = require('../../db');
let util = require('../../common/util');
const codes = require('../../common/codes');
let store = db.getInstance();
class NodesController {
    getFocusedNode(req,res,next) {
        res.json({ message: 'Welcome to Nodes! ' + req.params.pid });
    }
}
module.exports = new NodesController();