const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = process.env.JWT_SECRET

const isAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Error al acceder' });
        }

        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        req.user = {
            id: user.id,
            email: user.email,
            rol: user.rol
        };

        next();
    });
};

const requireRole = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No autenticado' });
    }

    if (!allowedRoles.includes(req.user.rol)) {
        return res.status(403).json({ message: 'Acceso denegado' });
    }

    next();
};

const isAdmin = requireRole('admin');

const isOwnerOrAdmin = (Model, options = {}) => async (req, res, next) => {
    const { authorField = 'authorId' } = options;
    const recordId = req.params.id;

    if (!recordId) {
        return res.status(400).json({ message: 'Falta el id del registro' });
    }

    const record = await Model.findByPk(recordId);

    if (!record) {
        return res.status(404).json({ message: 'Registro no encontrado' });
    }

    if (!req.user) {
        return res.status(401).json({ message: 'No autenticado' });
    }

    const isAdminUser = req.user.rol === 'admin';
    const isOwner = String(record[authorField]) === String(req.user.id);

    if (isAdminUser || isOwner) {
        return next();
    }

    return res.status(403).json({ message: 'No tienes permiso para esta acción' });
};

module.exports = {
    isAuth,
    requireRole,
    isAdmin,
    isOwnerOrAdmin
};