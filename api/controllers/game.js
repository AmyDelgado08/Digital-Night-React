const Game = require('../models/GameModel');

// 1. Obtener todos los juegos
const getGames = async (req, res) => {
    try {
        const games = await Game.findAll();
        res.json(games);
    } catch (error) {
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
        res.json(game);
    } catch (error) {
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
        const newGame = await Game.create({ title, platforms, description });
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

module.exports = {
    getGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame
};