const { Partida } = require('../models')

const getPartida = async (req, res) => {
    try {
        const partida = await Partida.findOne({
            where: { userId: req.user.id, gameId: req.params.id }
        })
        res.type('text/plain').send(partida ? partida.datos : '')
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar el progreso' })
    }
}

const guardarPartida = async (req, res) => {
    try {
        if (typeof req.body !== 'string' || req.body.length > 10000) {
            return res.status(400).json({ message: 'Progreso inválido' })
        }
        const partida = await Partida.findOne({
            where: { userId: req.user.id, gameId: req.params.id }
        })
        if (partida) {
            await partida.update({ datos: req.body })
        } else {
            await Partida.create({ userId: req.user.id, gameId: req.params.id, datos: req.body })
        }
        res.json({ message: 'Progreso guardado' })
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar el progreso' })
    }
}

module.exports = { getPartida, guardarPartida }
