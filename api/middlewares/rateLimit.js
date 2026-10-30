const rateLimit = (max, ventanaMs) => {
    const visitas = {}

    return (req, res, next) => {
        const ip = req.ip
        const ahora = Date.now()

        if (!visitas[ip] || ahora - visitas[ip].inicio > ventanaMs) {
            visitas[ip] = { cantidad: 0, inicio: ahora }
        }

        visitas[ip].cantidad++

        if (visitas[ip].cantidad > max) {
            const segundos = Math.ceil((visitas[ip].inicio + ventanaMs - ahora) / 1000)
            res.setHeader('Retry-After', segundos)
            return res.status(429).json({
                message: `Demasiadas peticiones. Proba de nuevo en ${segundos} segundos`
            })
        }

        next()
    }
}

module.exports = rateLimit
