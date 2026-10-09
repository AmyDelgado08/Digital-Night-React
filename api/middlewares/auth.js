const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = 'misecreto'

const isAuth = (req, res, next) => {
    //Agarramos el token
    const token = req.headers['authorization']

    //jwt.verify desencripta el token usando nuestra palabra secreta
    //decoded tendra los datos q guardamos al hacer el login
    jwt.verify(token, SECRET, async (err, decoded) => {        
        //Si el token no existe o expiro
        if (err) return res.status(401).json({ message: 'Error al acceder' })

        //Buscamos en la bd si el ID del token sigue existiendo
        const user = await User.findByPk(decoded.id)

        if (!user) return res.json({ message: 'Usuario no encontrado' })

        //Guardamos los datos verificados
        req.user = {
            id: user.id,
            email: user.email
        }
        next()
    });
}

module.exports = {
    isAuth
}