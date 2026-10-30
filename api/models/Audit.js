const sequelize = require("../config/db");
const { DataTypes } = require('sequelize')

//Creamos el modelo "Audit" (Crea una tabla "Audits" en mySQL)
//Cada fila es UNA peticion que alguien hizo a la API
const Audit = sequelize.define('Audit', {
    metodo: {
        type: DataTypes.STRING, //GET, POST, PUT o DELETE
        allowNull: false,
    },
    ruta: {
        type: DataTypes.STRING, //ej: /games/5
        allowNull: false,
    },
    estado: {
        type: DataTypes.INTEGER, //codigo de respuesta: 200, 401, 429, etc
    },
    duracionMs: {
        type: DataTypes.INTEGER, //cuantos milisegundos tardo la API en responder
    },
    ip: {
        type: DataTypes.STRING, //desde que IP vino la peticion
    },
    origen: {
        type: DataTypes.STRING, //desde que pagina vino (ej: http://localhost:5173 = nuestro frontend)
    },
    navegador: {
        type: DataTypes.STRING(500), //el "User-Agent": que navegador / programa uso
    },
    userId: {
        type: DataTypes.INTEGER, //id del usuario logueado (null si no estaba logueado)
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING, //email del usuario logueado (null si no estaba logueado)
        allowNull: true,
    },
}, {
    timestamps: true, //createdAt = fecha y hora de la peticion
    modelName: 'Audit'
})

module.exports = Audit
