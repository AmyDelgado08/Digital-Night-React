const sequelize = require("../config/db");
const { DataTypes } = require('sequelize') //DataTypes nos permite decirle a la bd que tipo de info va a guardar cada columna (text, num, fechas, etc)

//Creamos el modelo "Game" (Crea una tabla "Game" en mySQL)
const Game = sequelize.define('Game', {
    title: {
        type: DataTypes.STRING, //tipo texto
        allowNull: false, //Este campo es obligatorio
    },
    platforms: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true, //Se creara automaticamente dos columnas para saber cuando se creo o modifico el juego
    modelName: 'Game'
})

module.exports = Game