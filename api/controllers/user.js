const User = require("../models/User")
const bcrypt = require('bcrypt') //libreria para encriptar contras
const jwt = require('jsonwebtoken') //libreria para crear los tokens d sesion

const SECRET = 'misecreto'

const getUsers = async (req, res) => {
    //findAll busca todos los registros
    // attributes... sirve para no enviarle las contraseñas al fronted tipo trae todo menos la contra
    const users = await User.findAll({ attributes: { exclude: 'password' } })
    res.json(users)
}

const getUserById = async (req, res) => {
    //findByPk busca el registro por su id
    //req... toma el num d id que viene en la url
    const user = await User.findByPk(req.params.id, { attributes: { exclude: 'password' } })
    res.json(user)
}

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body //Agarramos los datos q envia el cuerpo de la peticion
    const hashedPassword = await bcrypt.hash(password, 10) //Encriptamos la contra usando 10 rondas sal (Es un pedazo d texto aleatorio)
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword
    })
    res.status(201).json({ message: 'El usuario se creo exitosamente'})
}

const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } }) //Buscamos el usuario por su email

    //Si no existe devolvemos este error
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' })
    const compare = await bcrypt.compare(password, user.password);

    //Comparamos la contraseña 
    if (!compare) return res.status(400).json({ message: 'Usuario o contraseña incorrecta' })

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '8h' });

    res.json({ token })
}

//Obtenemos los datos del perfil actualmente logueado
const me = async (req, res) => {
    const user = await User.findByPk(req.user.id, {
        attributes: { exclude: 'password' }
    })
    res.json(user)
}

const updateUser = async (req, res) => {
        // Agarramos los datos que el usuario quiere modificar desde el frontend
        const { firstName, lastName, username, bio } = req.body;
        
        //Actualizamos el registro en la bd asegurando de que modifique solo el suyo
        await User.update({ firstName, lastName, username, bio }, { where: { id: req.user.id } }
        );
        
        res.json({ message: 'Perfil actualizado con éxito' });
}

module.exports = {
    getUsers,
    getUserById,
    registerUser,
    login,
    me,
    updateUser
}
