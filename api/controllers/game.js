const { Op } = require('sequelize');
const Game = require('../models/GameModel');
const User = require('../models/User');
const Favorite = require('../models/Favorite');
const Rating = require('../models/Rating');

// 1. Obtener todos los juegos publicados (con soporte de búsqueda ?q=)
const getGames = async (req, res) => {
    try {
        const { q } = req.query;
        const where = {
            status: 'publicado'
        };

        if (q && q.trim()) {
            const search = `%${q.trim()}%`;
            where[Op.or] = [
                { title: { [Op.like]: search } },
                { description: { [Op.like]: search } },
                { subject: { [Op.like]: search } }
            ];
        }

        const games = await Game.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        const authorIds = [...new Set(games.map((g) => g.authorId))];
        const autores = await User.findAll({
            where: { id: authorIds },
            attributes: ['id', 'firstName', 'lastName']
        });

        const resultado = games.map((game) => {
            const autor = autores.find((user) => user.id === game.authorId);
            return { ...game.toJSON(), author: autor || null };
        });

        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los juegos' });
    }
};

// 2. Obtener un juego específico por ID
// Si no está publicado, solo lo ven el autor y los administradores
const getGameById = async (req, res) => {
    try {
        const game = await Game.findByPk(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Juego no encontrado' });
        }

        // Si el juego no está publicado, solo lo ven el autor y los admin
        if (game.status !== 'publicado') {
            const isOwner = req.user && req.user.id === game.authorId;
            const isAdmin = req.user && req.user.rol === 'admin';
            if (!isOwner && !isAdmin) {
                return res.status(403).json({ message: 'Este juego no está disponible o se encuentra en revisión' });
            }
        }

        // Datos públicos del autor (nunca contraseña ni email privado)
        const author = await User.findByPk(game.authorId, {
            attributes: ['id', 'firstName', 'lastName']
        });

        // Cuántas personas lo tienen en favoritos
        const favoritesCount = await Favorite.count({ where: { gameId: game.id } });

        // Si inició sesión (optionalAuth), vemos si ya lo tiene guardado
        let isFavorite = false;
        if (req.user) {
            const favorito = await Favorite.findOne({
                where: { userId: req.user.id, gameId: game.id }
            });
            isFavorite = !!favorito;
        }

        // Estadísticas de valoraciones (Rating)
        const ratings = await Rating.findAll({ where: { gameId: game.id } });
        const ratingsCount = ratings.length;
        const avgRating = ratingsCount > 0
            ? Number((ratings.reduce((acc, r) => acc + r.score, 0) / ratingsCount).toFixed(1))
            : 0;

        let myRating = null;
        if (req.user) {
            const userRating = ratings.find((r) => r.userId === req.user.id);
            if (userRating) {
                myRating = userRating.score;
            }
        }

        res.json({
            ...game.toJSON(),
            author,
            avgRating,
            ratingsCount,
            favoritesCount,
            myRating,
            isFavorite
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al buscar el juego' });
    }
};

// 3. Crear un nuevo juego
// Al crear, queda en 'pendiente' (si lo crea un admin, se publica directo)
const createGame = async (req, res) => {
    const { title, platforms, description, subject, grade, gameUrl } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'El título y la descripción son obligatorios' });
    }

    try {
        const files = req.files || {};
        const status = req.user && req.user.rol === 'admin' ? 'publicado' : 'pendiente';

        const newGame = await Game.create({
            title,
            platforms,
            description,
            subject,
            grade,
            gameUrl,
            authorId: req.user.id,
            status,
            coverImage: files.coverImage ? `/uploads/${files.coverImage[0].filename}` : null,
            screenshots: files.screenshots ? files.screenshots.map((f) => `/uploads/${f.filename}`) : [],
            gameFile: files.gameFile ? `/uploads/${files.gameFile[0].filename}` : null,
        });

        res.status(201).json(newGame);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al guardar el juego' });
    }
};

// 4. Actualizar los datos de un juego
// Si el autor lo edita, vuelve al estado 'pendiente' para su revisión
const updateGame = async (req, res) => {
    const { title, platforms, description, subject, grade, gameUrl } = req.body;

    try {
        const game = await Game.findByPk(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Juego no encontrado' });
        }

        const changes = { title, platforms, description, subject, grade, gameUrl };

        // Si el usuario no es admin (es el autor), vuelve a pendiente
        if (!req.user || req.user.rol !== 'admin') {
            changes.status = 'pendiente';
            changes.rejectionReason = null;
        }

        // Solo se reemplazan los archivos si se subió uno nuevo
        const files = req.files || {};
        if (files.coverImage) changes.coverImage = `/uploads/${files.coverImage[0].filename}`;
        if (files.screenshots) changes.screenshots = files.screenshots.map((f) => `/uploads/${f.filename}`);
        if (files.gameFile) changes.gameFile = `/uploads/${files.gameFile[0].filename}`;

        // Sacamos los undefined para no sobreescribir datos existentes
        Object.keys(changes).forEach((k) => changes[k] === undefined && delete changes[k]);

        await game.update(changes);
        res.json({ message: 'Juego actualizado con éxito', game });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el juego' });
    }
};

// 5. Eliminar un juego
const deleteGame = async (req, res) => {
    try {
        const game = await Game.findByPk(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Juego no encontrado' });
        }

        await game.destroy();
        res.json({ message: 'Juego eliminado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el juego' });
    }
};

// 6. Obtener los juegos del usuario que inició sesión
const getMyGames = async (req, res) => {
    try {
        const games = await Game.findAll({
            where: {
                authorId: req.user.id
            },
            order: [['updatedAt', 'DESC']]
        });

        res.json(games);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener tus juegos'
        });
    }
};

// 7. Panel admin: Obtener juegos (con filtro opcional por status ?status=)
const getAdminGames = async (req, res) => {
    try {
        const { status } = req.query;
        const where = {};
        if (status) {
            where.status = status;
        }

        const games = await Game.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        const authorIds = [...new Set(games.map((g) => g.authorId))];
        const autores = await User.findAll({
            where: { id: authorIds },
            attributes: ['id', 'firstName', 'lastName', 'email']
        });

        const resultado = games.map((game) => {
            const autor = autores.find((u) => u.id === game.authorId);
            return {
                ...game.toJSON(),
                author: autor || null
            };
        });

        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los juegos para administración' });
    }
};

// 8. Panel admin: Revisar juego (aprobar o rechazar con motivo)
const reviewGame = async (req, res) => {
    const { status, reason, rejectionReason } = req.body;
    const motivo = reason || rejectionReason;

    try {
        const game = await Game.findByPk(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Juego no encontrado' });
        }

        if (status === 'rechazado' && (!motivo || !String(motivo).trim())) {
            return res.status(400).json({ message: 'El motivo de rechazo es obligatorio' });
        }

        const updates = {
            status,
            rejectionReason: status === 'rechazado' ? String(motivo).trim() : null
        };

        await game.update(updates);

        res.json({
            message: status === 'publicado'
                ? 'Juego aprobado y publicado con éxito'
                : 'Juego rechazado con éxito',
            game
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al revisar el juego' });
    }
};

module.exports = {
    getGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame,
    getMyGames,
    getAdminGames,
    reviewGame
};
