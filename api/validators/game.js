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

const reviewGameRules = [
    body('status')
        .trim()
        .notEmpty().withMessage('El estado es obligatorio')
        .isIn(['publicado', 'rechazado']).withMessage('El estado debe ser publicado o rechazado'),
    body('reason')
        .if(body('status').equals('rechazado'))
        .custom((val, { req }) => {
            const motivo = val || req.body.rejectionReason;
            if (!motivo || !String(motivo).trim()) {
                throw new Error('El motivo de rechazo es obligatorio');
            }
            return true;
        })
]

module.exports = {
    createGameRules,
    updateGameRules,
    reviewGameRules
}
