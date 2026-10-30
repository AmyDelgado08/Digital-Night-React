const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Carpeta donde se guardan los archivos (se crea sola si no existe)
const uploadsDir = path.join(__dirname, '..', 'uploads')
fs.mkdirSync(uploadsDir, { recursive: true })

// Cómo se guardan: en uploads, con un nombre único para que no se pisen
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const unico = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, unico + path.extname(file.originalname).toLowerCase())
    }
})

// Qué se acepta: imágenes PNG/JPG y, para el archivo del juego, .zip .rar .7z .html
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'gameFile') {
        const ext = path.extname(file.originalname).toLowerCase()
        if (['.zip', '.rar', '.7z', '.html'].includes(ext)) return cb(null, true)
        return cb(new Error('El archivo del juego debe ser .zip, .rar, .7z o .html'))
    }
    if (['image/png', 'image/jpeg'].includes(file.mimetype)) return cb(null, true)
    cb(new Error('Las imágenes deben ser PNG o JPG'))
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50 MB por archivo
})

// Campos del formulario: 1 portada, hasta 3 capturas y 1 archivo del juego
const subirArchivos = upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'screenshots', maxCount: 3 },
    { name: 'gameFile', maxCount: 1 },
])

// Igual, pero responde con un mensaje claro si algo sale mal
const handleUpload = (req, res, next) => {
    subirArchivos(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'Un archivo supera el tamaño máximo de 50 MB' })
            }
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({ message: 'Podés subir 1 portada, hasta 3 capturas y 1 archivo del juego' })
            }
            return res.status(400).json({ message: err.message })
        }
        if (err) return res.status(400).json({ message: err.message })
        next()
    })
}

module.exports = handleUpload