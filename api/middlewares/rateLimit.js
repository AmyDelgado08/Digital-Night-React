//Middleware de RATE LIMIT (limite de peticiones)
//Cuenta cuantas peticiones hace cada IP en un tiempo dado.
//Si se pasa del maximo, responde 429 "Too Many Requests" y no la deja seguir.

//Recibe la configuracion y devuelve el middleware (igual que requireRole('admin'))
//  max      -> cuantas peticiones se permiten
//  ventanaMs -> en cuantos milisegundos (60000 ms = 1 minuto)
const rateLimit = (max, ventanaMs) => {

    //Aca guardamos las visitas de cada IP. Ejemplo:
    //  { '190.10.1.5': { cantidad: 3, inicio: 1730000000000 } }
    const visitas = {}

    return (req, res, next) => {
        const ip = req.ip
        const ahora = Date.now()

        //Si la IP es nueva, o ya paso su ventana de tiempo, empieza de cero
        if (!visitas[ip] || ahora - visitas[ip].inicio > ventanaMs) {
            visitas[ip] = { cantidad: 0, inicio: ahora }
        }

        visitas[ip].cantidad++ //sumamos esta peticion

        //Si se paso del maximo, la frenamos
        if (visitas[ip].cantidad > max) {
            const segundos = Math.ceil((visitas[ip].inicio + ventanaMs - ahora) / 1000)
            res.setHeader('Retry-After', segundos) //le decimos cuando puede volver a intentar
            return res.status(429).json({
                message: `Demasiadas peticiones. Proba de nuevo en ${segundos} segundos`
            })
        }

        next() //todavia esta dentro del limite: sigue
    }
}

module.exports = rateLimit
