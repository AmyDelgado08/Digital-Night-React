const { body } = require('express-validator')

const ratingRules = [
    body('score').isInt({ min: 1, max: 5 }).withMessage('La valoración tiene que ser de 1 a 5 estrellas')
]

module.exports = { ratingRules }
