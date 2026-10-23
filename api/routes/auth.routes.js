const express = require('express');
const router = express.Router();
const { forgotPassword, resetPassword } = require('../controllers/auth');
const validate = require('../middlewares/validate');
const { changePasswordRules } = require('../validators/user');

// Rutas de recuperación de contraseña
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', changePasswordRules, validate, resetPassword);

// Soporte adicional en caso de que se monte sin prefijo
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', changePasswordRules, validate, resetPassword);

module.exports = router;
