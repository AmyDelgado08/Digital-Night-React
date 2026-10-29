const sequelize = require("../config/db");
const { DataTypes } = require('sequelize') //DataTypes nos permite decirle a la bd que tipo de info va a guardar cada columna (text, num, fechas, etc)

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
        allowNull: false,
    },
    plays: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    videoUrl: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true, //Se creara automaticamente dos columnas para saber cuando se creo o modifico el juego
    modelName: 'Game'
})

module.exports = Game