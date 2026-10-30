const Audit = require('../models/Audit')

//Middleware de AUDITORIA
//Guarda en la base de datos quien hizo cada peticion a la API, a que ruta y como le fue
const audit = (req, res, next) => {
    const inicio = Date.now() //anotamos la hora en que llego la peticion

    //'finish' se dispara cuando la API YA respondio.
    //Esperamos a ese momento porque recien ahi sabemos:
    //  - el codigo de respuesta (200, 401, 429...)
    //  - quien era el usuario (isAuth carga req.user mas adelante, en la ruta)
    res.on('finish', async () => {
        try {
            await Audit.create({
                metodo: req.method,
                ruta: req.originalUrl,
                estado: res.statusCode,
                duracionMs: Date.now() - inicio,
                ip: req.ip,
                origen: req.headers.origin || null,
                navegador: (req.headers['user-agent'] || '').slice(0, 500),
                userId: req.user ? req.user.id : null,
                email: req.user ? req.user.email : null,
            })
        } catch (error) {
            //Si falla el guardado NO rompemos la API, solo avisamos por consola
            console.log('No se pudo guardar la auditoria:', error.message)
        }
    })

    next() //dejamos pasar la peticion a la siguiente funcion
}

module.exports = audit
