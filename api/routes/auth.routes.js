const express = require('express');
const router = express.Router();
const { forgotPassword, resetPassword } = require('../controllers/auth');

// Rutas de recuperación de contraseña
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Soporte adicional en caso de que se monte sin prefijo
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);

module.exports = router;
