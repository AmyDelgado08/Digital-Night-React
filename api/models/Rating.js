const sequelize = require("../config/db");
const { DataTypes } = require('sequelize')

const Rating = sequelize.define('Rating', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    gameId: { type: DataTypes.INTEGER, allowNull: false },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
}, {
    timestamps: true,
    modelName: 'Rating',
    indexes: [{ unique: true, fields: ['userId', 'gameId'] }]
})

module.exports = Rating