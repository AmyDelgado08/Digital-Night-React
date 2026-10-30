const Audit = require('../models/Audit')

const audit = (req, res, next) => {
    const inicio = Date.now()

    res.on('finish', async () => {
        try {
            await Audit.create({
                metodo: req.method,
                ruta: req.originalUrl,
                estado: res.statusCode,
                duracionMs: Date.now() - inicio,
                ip: req.ip,
                origen: req.headers.origin || req.headers.referer || null,
                navegador: (req.headers['user-agent'] || '').slice(0, 500),
                userId: req.user ? req.user.id : null,
                email: req.user ? req.user.email : null,
            })
        } catch (error) {
            console.log('No se pudo guardar la auditoria:', error.message)
        }
    })

    next()
}

module.exports = audit
