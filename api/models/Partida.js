const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const Partida = sequelize.define('Partida', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    gameId: { type: DataTypes.INTEGER, allowNull: false },
    datos: { type: DataTypes.TEXT, allowNull: false },
}, {
    timestamps: true,
    indexes: [{ unique: true, fields: ['userId', 'gameId'] }],
})

module.exports = Partida
