require('dotenv').config()
const express = require('express')
const path = require('path')
const handleUpload = require('./middlewares/upload')

const { getUsers, registerUser, login, me, updateUser, updateMe, updatePassword, deleteUser, updateUserByAdmin, getProfile} = require('./controllers/user')
const { getGames, getGameById, createGame, updateGame, deleteGame, getMyGames, getAdminGames, reviewGame } = require('./controllers/game')
const authRoutes = require('./routes/auth.routes')
const { addFavorite, removeFavorite, playGame, getMyLibrary } = require('./controllers/library')
const { isAuth , requireRole, isOwnerOrAdmin, optionalAuth} = require('./middlewares/auth')
const sequelize = require('./config/db')
const { Game } = require('./models')
const userRoutes = require('./routes/user.routes');
const validate = require('./middlewares/validate')
const { registerRules, loginRules, changePasswordRules, updateEmailRules } = require('./validators/user')
const { createGameRules, updateGameRules, reviewGameRules } = require('./validators/game')
const audit = require('./middlewares/audit')
const rateLimit = require('./middlewares/rateLimit')
const { getAudits } = require('./controllers/audit')

const server = express()

server.set('trust proxy', 1)

server.use(express.json())
// Sirve las imágenes subidas: http://localhost:3000/uploads/<archivo>
server.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Middleware CORS
server.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

server.use(audit)

server.use(rateLimit(100, 60 * 1000))

const limiteLogin = rateLimit(5, 60 * 1000)

// Autenticación pública / general
server.post('/users', registerRules, validate, registerUser)
server.post('/login', limiteLogin, loginRules, validate, login)
server.post('/auth/forgot-password', limiteLogin)
server.use('/auth', authRoutes)

// Rutas de Usuario Autenticado
server.get('/me', isAuth, me)
server.put('/users/update', isAuth, updateEmailRules, validate, updateUser)
server.put('/users/me', isAuth, updateEmailRules, validate, updateMe) // Debe ir ANTES de PUT /users/:id (si no, Express tomaria "me" como un id)
server.put('/users/password', isAuth, changePasswordRules, validate, updatePassword)
server.delete('/users/me', isAuth, deleteUser)
server.get('/me/library', isAuth, getMyLibrary) //Biblioteca: favoritos y jugados recientemente
server.get('/profiles/:id', optionalAuth, getProfile);

// Rutas de Juegos
server.get('/games', getGames);
server.get('/games/mine', isAuth, getMyGames);
server.get('/games/:id', optionalAuth, getGameById);
server.post('/games/:id/favorite', isAuth, addFavorite);     // Guardar en favoritos
server.delete('/games/:id/favorite', isAuth, removeFavorite); // Quitar de favoritos
server.post('/games/:id/play', optionalAuth, playGame);      // Jugar (suma una jugada)
server.post('/games', isAuth, handleUpload, createGameRules, validate, createGame);
server.put('/games/:id', isAuth, isOwnerOrAdmin(Game), handleUpload, updateGameRules, validate, updateGame);
server.delete('/games/:id', isAuth, isOwnerOrAdmin(Game), deleteGame);

// RUTAS EXCLUSIVAS DE ADMIN
server.get('/users', isAuth, requireRole('admin'), getUsers);
server.delete('/users/:id', isAuth, requireRole('admin'), deleteUser);
server.put('/users/:id', isAuth, requireRole('admin'), updateUserByAdmin);
server.get('/audit', isAuth, requireRole('admin'), getAudits);
server.get('/admin/games', isAuth, requireRole('admin'), getAdminGames);
server.put('/admin/games/:id/review', isAuth, requireRole('admin'), reviewGameRules, validate, reviewGame);

server.use(userRoutes);

server.use(optionalAuth, (req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' })
})

server.use((err, req, res, next) => {
    console.log('Error:', err.message)
    const estado = err.status || 500
    res.status(estado).json({
        message: estado === 500 ? 'Error interno del servidor' : 'Petición inválida'
    })
})

server.listen(3000, async () => {
    await sequelize.sync({ force: false })
    console.log("El server esta corriendo en el puerto 3000");
})
