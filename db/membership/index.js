const { DataTypes } = require('sequelize');
let Person = require('../person');
let db = require('../index.js');
let store = db.getInstance();
module.exports = store.define(
    'membership',
    {
        person_id: {
            type: DataTypes.STRING(12),
            allowNull: false,
            primaryKey: true,
            references: {
                model: Person,
                key: 'id',
            },
        },
        status: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        tree_id: {
            type: DataTypes.STRING(12),
            allowNull: false,
            primaryKey: true
        },
        invited_by_id: {
            type: DataTypes.STRING(12),
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        invited_by_id: {
            type: DataTypes.STRING(12),
            allowNull: false,
        },
        created_by_id: {
            type: DataTypes.STRING(12),
            allowNull: false,
        },
        modified_by_id: {
            type: DataTypes.STRING(12),
            allowNull: false,
        },
    },
    {
        schema: 'fbfs',
        timestamps: false,
        freezeTableName: true,
    }
);