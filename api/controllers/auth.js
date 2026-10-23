const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'misecreto';

// POST /auth/forgot-password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Buscar el usuario por email
        const user = await User.findOne({ where: { email } });

        // 2. Si existe, crear el token y armar el enlace
        if (user) {
            const token = jwt.sign(
                { id: user.id, tipo: 'reset' },
                JWT_SECRET,
                { expiresIn: '15m' }
            );

            const resetLink = `http://localhost:5173/restablecer/${token}`;

            // Simulación del envío de correo: se muestra en la consola del servidor
            console.log('--------------------------------------------------');
            console.log(`Enlace de restablecimiento para ${email}:`);
            console.log(resetLink);
            console.log('--------------------------------------------------');
        }

        // 3. Responder SIEMPRE lo mismo, exista o no el email (prevención de enumeración de usuarios)
        return res.json({
            message: 'Si el email existe, te enviamos un enlace para restablecer tu contraseña'
        });
    } catch (error) {
        console.error('Error en forgotPassword:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// POST /auth/reset-password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'El token y la nueva contraseña son obligatorios' });
        }

        // 1. Verificar si el token es válido o venció
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ message: 'El enlace no es válido o venció' });
        }

        // 2. Comprobar que el token tenga tipo === 'reset'
        if (decoded.tipo !== 'reset') {
            return res.status(400).json({ message: 'El enlace no es válido o venció' });
        }

        // 3. Hashear la nueva contraseña con bcrypt
        const hash = await bcrypt.hash(newPassword, 10);

        // 4. Guardarla en la base de datos
        await User.update({ password: hash }, { where: { id: decoded.id } });

        // 5. Responder con éxito
        return res.json({ message: 'Contraseña actualizada' });
    } catch (error) {
        console.error('Error en resetPassword:', error);
        return res.status(500).json({ message: 'Error al actualizar la contraseña' });
    }
};

module.exports = {
    forgotPassword,
    resetPassword
};
