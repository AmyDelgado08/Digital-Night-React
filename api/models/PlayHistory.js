const sequelize = require("../config/db");
const { DataTypes } = require('sequelize')

const PlayHistory = sequelize.define('PlayHistory', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lastPlayedAt: {
        type: DataTypes.DATE, //fecha y hora de la ultima vez que lo jugo
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true,
    modelName: 'PlayHistory'
})

module.exports = PlayHistory
