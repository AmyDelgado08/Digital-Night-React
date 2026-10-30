const Audit = require('../models/Audit')

const getAudits = async (req, res) => {
    try {
        const registros = await Audit.findAll({
            order: [['createdAt', 'DESC']],
            limit: 100
        })
        res.json(registros)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la auditoria' })
    }
}

module.exports = { getAudits }
