const { DataTypes } = require('sequelize');
let db = require('../index.js');
let store = db.getInstance();
module.exports = store.define(
    'verification_code',
    {
        username: {
            type: DataTypes.STRING(50),
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING(4),
        },
    },
    {
        schema: 'fbfs',
        timestamps: false,
        freezeTableName: true,
    }
);