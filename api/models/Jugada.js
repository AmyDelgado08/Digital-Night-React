const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const Jugada = sequelize.define('Jugada', {
    gameId: { type: DataTypes.INTEGER, allowNull: false },
    ip: { type: DataTypes.STRING, allowNull: false },
}, {
    timestamps: true,
    indexes: [{ unique: true, fields: ['gameId', 'ip'] }],
})

module.exports = Jugada
