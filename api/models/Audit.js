const sequelize = require("../config/db");
const { DataTypes } = require('sequelize')

const Audit = sequelize.define('Audit', {
    metodo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ruta: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estado: {
        type: DataTypes.INTEGER,
    },
    duracionMs: {
        type: DataTypes.INTEGER,
    },
    ip: {
        type: DataTypes.STRING,
    },
    origen: {
        type: DataTypes.STRING,
    },
    navegador: {
        type: DataTypes.STRING(500),
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    modelName: 'Audit'
})

module.exports = Audit
