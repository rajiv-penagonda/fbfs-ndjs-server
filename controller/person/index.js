const { Op } = require('sequelize');
const cc = require('../../controller/code');
const ac = require('../../controller/auth');
const db = require('../../db');
const User = require('../../db/user');
const Code = require('../../db/code');
const Tree = require('../../db/tree');
const Person = require('../../db/person');
const Membership = require('../../db/Membership');
const IDGen = require('../../db/id_gen');
const util = require('../../common/util');
const codes = require('../../common/codes');
const helper = require('./helper.js');
const store = db.getInstance();
class PersonController {

}
module.exports = new PersonController();