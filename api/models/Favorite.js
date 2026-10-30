const sequelize = require("../config/db");
const { DataTypes } = require('sequelize')

const Favorite = sequelize.define('Favorite', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    gameId: { type: DataTypes.INTEGER, allowNull: false },
}, {
    timestamps: true,
    modelName: 'Favorite',
    indexes: [{ unique: true, fields: ['userId', 'gameId'] }]
})

module.exports = Favorite