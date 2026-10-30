const Audit = require('../models/Audit')

//GET /audit -> devuelve las ultimas 100 peticiones registradas (solo admin)
const getAudits = async (req, res) => {
    try {
        const registros = await Audit.findAll({
            order: [['createdAt', 'DESC']], //las mas nuevas primero
            limit: 100
        })
        res.json(registros)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la auditoria' })
    }
}

module.exports = { getAudits }
