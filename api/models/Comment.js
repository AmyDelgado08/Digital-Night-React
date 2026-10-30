const sequelize = require("../config/db");
const { DataTypes } = require('sequelize')

const Comment = sequelize.define('Comment', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    gameId: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.STRING(500), allowNull: false },
}, {
    timestamps: true,
    modelName: 'Comment'
})

module.exports = Comment