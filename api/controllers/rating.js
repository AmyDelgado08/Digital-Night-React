const { Game, Rating } = require('../models')

const rateGame = async (req, res) => {
    try {
        const game = await Game.findByPk(req.params.id)
        if (!game) {
            return res.status(404).json({ message: 'Juego no encontrado' })
        }
        if (game.authorId === req.user.id) {
            return res.status(403).json({ message: 'No podés valorar tu propio juego' })
        }

        const score = Number(req.body.score)
        const voto = await Rating.findOne({ where: { userId: req.user.id, gameId: game.id } })
        if (voto) {
            await voto.update({ score })
        } else {
            await Rating.create({ userId: req.user.id, gameId: game.id, score })
        }

        const ratings = await Rating.findAll({ where: { gameId: game.id } })
        const suma = ratings.reduce((total, r) => total + r.score, 0)
        res.json({
            myRating: score,
            ratingsCount: ratings.length,
            avgRating: Number((suma / ratings.length).toFixed(1)),
        })
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar la valoración' })
    }
}

module.exports = { rateGame }
