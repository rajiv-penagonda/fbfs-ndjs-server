const { DataTypes } = require('sequelize');
let db = require('../index.js');
let store = db.getInstance();
module.exports = store.define(
    'person',
    {
        given_name: {
            type: DataTypes.STRING(25),
            allowNull: false,
        },
        surname: {
            type: DataTypes.STRING(40),
        },
        nicknames: {
            type: DataTypes.STRING(42),
        },
        email: {
            type: DataTypes.STRING(50),
        },
        phone: {
            type: DataTypes.STRING(20),
        },
        media_uri: {
            type: DataTypes.STRING(80),
        },
        birth_date: {
            type: DataTypes.DATEONLY,
        },
        deceased_date: {
            type: DataTypes.DATEONLY,
        },
        gender: {
            type: DataTypes.STRING(6),
        },
        lives_in: {
            type: DataTypes.STRING(70),
        },
        bio: {
            type: DataTypes.STRING(2500),
        },
        created_by_id: {
            type: DataTypes.STRING(12),
        },
        modified_by_id: {
            type: DataTypes.STRING(12),
        },
        tree_id: {
            type: DataTypes.STRING(12),
        },
        user_id: {
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