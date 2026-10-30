const { body } = require('express-validator')
const User = require('../models/User')

const registerRules = [
    body('firstName').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('El email no es válido'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
]

const loginRules = [
    body('email').isEmail().withMessage('El email no es válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
]

const changePasswordRules = [
    body('newPassword').isLength({ min: 8 }).withMessage('La nueva contraseña debe tener al menos 8 caracteres')
]

const updateEmailRules = [
    body('email')
        .optional()
        .isEmail().withMessage('El email no es válido')
        .custom(async (email, { req }) => {
            const usuario = await User.findOne({ where: { email } })
            if (usuario && usuario.id !== req.user.id) {
                throw new Error('Ese email ya está en uso')
            }
        })
]

module.exports = {
    registerRules,
    loginRules,
    changePasswordRules,
    updateEmailRules
}
