const sequelize = require("../config/db");
const { DataTypes } = require('sequelize') //DataTypes nos permite decirle a la bd que tipo de info va a guardar cada columna (text, num, fechas, etc)

//Creamos el modelo "User" (Crea una tabla "User" en mySQL)
const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING, //tipo texto
        allowNull: false, //Este campo es obligatorio
    },
    lastName: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, //evita duplicados
         validate: {
            isEmail: true,  //Sequelize comprueba q tenga el arroba y algun dominio (no verifica q el correo exista en la vida real)
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    rol: {
        type: DataTypes.STRING,
        defaultValue: 'user' //Por defecto se creara siendo User hasta q le asignemos otro rol luego
    },
}, {
    timestamps: true, //Se creara automaticamente dos columnas para saber cuando se creo o modifico el user
    modelName: 'User'
})

module.exports = User