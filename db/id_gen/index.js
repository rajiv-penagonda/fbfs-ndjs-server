const { DataTypes } = require('sequelize');
let db = require('../index.js');
let store = db.getInstance();
module.exports = store.define(
    'id_gen',
    {
        entity: {
            type: DataTypes.STRING(25),
            allowNull: false,
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