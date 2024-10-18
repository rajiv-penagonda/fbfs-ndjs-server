const { DataTypes } = require('sequelize');
let db = require('../index.js');
let store = db.getInstance();
module.exports = store.define(
    'tree',
    {
        created_by_id: {
            type: DataTypes.STRING(12),
        },
        modified_by_id: {
            type: DataTypes.STRING(12),
        },
        id: {
            type: DataTypes.STRING(12),
            primaryKey: true,
        },
    },
    {
        schema: 'fbfs',
        timestamps: false,
        freezeTableName: true,
    }
);