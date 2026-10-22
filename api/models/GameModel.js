const sequelize = require("../config/db");
const { DataTypes } = require('sequelize')

const Game = sequelize.define('Game', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    platforms: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    timestamps: true,
    modelName: 'Game'
})

module.exports = Game
