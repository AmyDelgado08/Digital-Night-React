const { body } = require('express-validator')

const createGameRules = [
    body('title').trim().notEmpty().withMessage('El título es obligatorio'),
    body('description').trim().notEmpty().withMessage('La descripción es obligatoria'),
    body('platforms').optional({ nullable: true }).isString().withMessage('Las plataformas deben ser texto')
]

const updateGameRules = [
    body('title').optional().trim().notEmpty().withMessage('El título no puede estar vacío'),
    body('description').optional().trim().notEmpty().withMessage('La descripción no puede estar vacía'),
    body('platforms').optional({ nullable: true }).isString().withMessage('Las plataformas deben ser texto')
]

module.exports = {
    createGameRules,
    updateGameRules
}
