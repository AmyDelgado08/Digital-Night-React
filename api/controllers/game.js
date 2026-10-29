const Game = require('../models/GameModel');
const User = require('../models/User');
const Favorite = require('../models/Favorite');

// 1. Obtener todos los juegos
const getGames = async (req, res) => {
    try {
        const games = await Game.findAll();

        const autores = await User.findAll({
            where: { id: games.map((game) => game.authorId) },
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
const getGameById = async (req, res) => {
    try {
        const game = await Game.findByPk(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Juego no encontrado' });
        }

        //Datos publicos del autor (nunca la contraseña ni el email)
        const author = await User.findByPk(game.authorId, {
            attributes: ['id', 'firstName', 'lastName']
        });

        //Cuantas personas lo tienen en favoritos
        const favoritesCount = await Favorite.count({ where: { gameId: game.id } });

        //Si inicio sesion (optionalAuth), vemos si ya lo tiene guardado
        let isFavorite = false;
        if (req.user) {
            const favorito = await Favorite.findOne({
                where: { userId: req.user.id, gameId: game.id }
            });
            isFavorite = !!favorito;
        }

        res.json({ ...game.toJSON(), author, favoritesCount, isFavorite });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al buscar el juego' });
    }
};

// 3. Crear un nuevo juego
const createGame = async (req, res) => {
    const { title, platforms, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'El título y la descripción son obligatorios' });
    }

    try {
        const newGame = await Game.create({ title, platforms, description, authorId: req.user.id });
        res.status(201).json(newGame);
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar el juego' });
    }
};

// 4. Actualizar los datos de un juego
const updateGame = async (req, res) => {
    const { title, platforms, description } = req.body;

    try {
        const game = await Game.findByPk(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Juego no encontrado' });
        }

        await game.update({ title, platforms, description });
        res.json({ message: 'Juego actualizado con éxito', game });
    } catch (error) {
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
        res.status(500).json({ message: 'Error al eliminar el juego' });
    }
};

// 6. Obtener los juegos del usuario que inició sesión
const getMyGames = async (req, res) => {
    try {
        const games = await Game.findAll({
            where: {
                authorId: req.user.id
            }
        });

        res.json(games);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener tus juegos'
        });
    }
};

module.exports = {
    getGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame,
    getMyGames
};