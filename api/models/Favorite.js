const sequelize = require("../config/db");
const { DataTypes } = require('sequelize')

const Favorite = sequelize.define('Favorite', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true, //createdAt nos dice cuando lo guardo
    modelName: 'Favorite'
})

module.exports = Favorite
