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
    const { firstName, lastName, email } = req.body;
    await User.update({ firstName, lastName, email }, { where: { id: req.user.id } });
    res.json({ message: 'Perfil actualizado con éxito' });
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id || req.user.id;
        await User.destroy({ where: { id: userId } });
        res.json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};
const updateUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params; // ID del usuario a modificar
        const { firstName, lastName, email, rol } = req.body; // Nuevos datos

        // 1. Buscamos al usuario en la base de datos
        const userToUpdate = await User.findByPk(id);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // 2. REGLA CLAVE: Validamos que el usuario objetivo NO sea admin
        if (userToUpdate.rol === 'admin') {
            return res.status(403).json({ 
                message: 'No se pueden modificar los datos de otro administrador.' 
            });
        }

        // 3. Actualizamos los campos permitidos
        await userToUpdate.update({
            firstName: firstName || userToUpdate.firstName,
            lastName: lastName || userToUpdate.lastName,
            email: email || userToUpdate.email,
            rol: rol || userToUpdate.rol // Opcional: si quieres permitir cambiarle el rol a admin en el futuro, o puedes omitirlo
        });

        res.json({ 
            message: 'Usuario actualizado correctamente por el administrador', 
            user: userToUpdate 
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error al actualizar el usuario', 
            error: error.message 
        });
    }
};

module.exports = {
    getUsers,
    getUserById,
    registerUser,
    login,
    me,
    updateUser,
    deleteUser,
    updateUserByAdmin
}
