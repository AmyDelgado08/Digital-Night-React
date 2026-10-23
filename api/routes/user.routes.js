const express = require('express');
const router = express.Router();

// Importamos la función
const { createUserByAdmin } = require('../controllers/user');

// Importamos los middleware
const { isAuth, requireRole } = require('../middlewares/auth');

//Ruta protegida con requireRole('admin')
router.post('/admin/users', isAuth, requireRole('admin'), createUserByAdmin);

module.exports = router;