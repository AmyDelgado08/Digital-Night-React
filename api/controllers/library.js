const Game = require('../models/GameModel');
const Favorite = require('../models/Favorite');
const PlayHistory = require('../models/PlayHistory');

// Guardar un juego en favoritos
const addFavorite = async (req, res) => {
    try {
        const game = await Game.findByPk(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Juego no encontrado' });
        }

        //Si ya lo tenia guardado no lo volvemos a crear
        const AlreadySaved  = await Favorite.findOne({
            where: { userId: req.user.id, gameId: game.id }
        });

        if (!AlreadySaved) {
            await Favorite.create({ userId: req.user.id, gameId: game.id });
        }

        const favoritesCount = await Favorite.count({ where: { gameId: game.id } });
        res.json({ message: 'Guardado en favoritos', isFavorite: true, favoritesCount });
    } 
    
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al guardar en favoritos' });
    }
};

// Quitar un juego de favoritos
const removeFavorite = async (req, res) => {
    try {
        await Favorite.destroy({
            where: { userId: req.user.id, gameId: req.params.id }
        });

        const favoritesCount = await Favorite.count({ where: { gameId: req.params.id } });
        res.json({ message: 'Quitado de favoritos', isFavorite: false, favoritesCount });
    } 
    
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al quitar de favoritos' });
    }
};

// Jugar un juego 
// Suma una jugada y si hay sesion lo guarda en "jugados recientemente"
const playGame = async (req, res) => {
    try {
        const game = await Game.findByPk(req.params.id);

        if (!game) {
            return res.status(404).json({ message: 'Juego no encontrado' });
        }

        //Sumamos 1 a las jugadas
        await game.update({ plays: game.plays + 1 });

        //Si inicio sesion guardamos cuando lo jugo
        if (req.user) {
            const historial = await PlayHistory.findOne({
                where: { userId: req.user.id, gameId: game.id }
            });

            if (historial) {
                await historial.update({ lastPlayedAt: new Date() });
            } 
            
            else {
                await PlayHistory.create({ userId: req.user.id, gameId: game.id, lastPlayedAt: new Date() });
            }
        }

        // Devolvemos el link o el archivo para que el front lo abra
        res.json({
            plays: game.plays,
            gameUrl: game.gameUrl || null,
            gameFile: game.gameFile || null
        });
    } 
    
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar el juego' });
    }
};

// Biblioteca del usuario logueado
const getMyLibrary = async (req, res) => {
    try {
        //el ultimo que guardo aparece primero
        const favoritos = await Favorite.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        const idsFavoritos = favoritos.map((fav) => fav.gameId);
        const juegosFavoritos = await Game.findAll({ where: { id: idsFavoritos } });

        // Los ordenamos igual que los favoritos
        const favorites = idsFavoritos
            .map((id) => juegosFavoritos.find((game) => game.id === id))
            .filter((game) => game); //sacamos los que ya no existen

        //Jugados recientemente (maximo 12)
        const historial = await PlayHistory.findAll({
            where: { userId: req.user.id },
            order: [['lastPlayedAt', 'DESC']],
            limit: 12
        });

        const idsJugados = historial.map((item) => item.gameId);
        const juegosJugados = await Game.findAll({ where: { id: idsJugados } });

        const recentlyPlayed = historial
            .map((item) => {
                const game = juegosJugados.find((g) => g.id === item.gameId);
                if (!game) return null;
                return { ...game.toJSON(), lastPlayedAt: item.lastPlayedAt };
            })
            .filter((game) => game);

        res.json({ favorites, recentlyPlayed });
    } 
    
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener tu biblioteca' });
    }
};

module.exports = {
    addFavorite,
    removeFavorite,
    playGame,
    getMyLibrary
};
