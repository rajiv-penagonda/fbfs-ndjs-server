const { Sequelize } = require('sequelize');
class DB {
    static _instance;
    static getInstance() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new Sequelize(process.env.DB_SCHEMA, process.argv[2], process.argv[3], {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: process.env.DB_DIALECT,
        });
        return this._instance;
    }
    static initModel() {
        const Tree = require('./tree');
        const Person = require('./person');
        Person.belongsTo(Tree, {as:"tree", foreignKey: "tree_id"});
        Person.belongsTo(Person, {as:"inviter", foreignKey: "invited_by_id"});
    }
}
module.exports = DB;