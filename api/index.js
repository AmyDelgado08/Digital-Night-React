require('dotenv').config()
const express = require('express')

const { getUsers, registerUser, login, me, updateUser, updateMe, updatePassword, deleteUser, updateUserByAdmin} = require('./controllers/user')
const { getGames, getGameById, createGame, updateGame, deleteGame, getMyGames } = require('./controllers/game')
const authRoutes = require('./routes/auth.routes')
const { addFavorite, removeFavorite, playGame, getMyLibrary } = require('./controllers/library')
const { isAuth , requireRole, isOwnerOrAdmin, optionalAuth} = require('./middlewares/auth')
const sequelize = require('./config/db')
const { Game } = require('./models')
const userRoutes = require('./routes/user.routes');
const validate = require('./middlewares/validate')
const { registerRules, loginRules, changePasswordRules } = require('./validators/user')
const { createGameRules, updateGameRules } = require('./validators/game')

const server = express()

server.use(express.json())

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

// Autenticación pública / general
server.post('/users', registerRules, validate, registerUser)
server.post('/login', loginRules, validate, login)
server.use('/auth', authRoutes)

// Rutas de Usuario Autenticado
server.get('/me', isAuth, me)
server.put('/users/update', isAuth, updateUser)
server.put('/users/me', isAuth, updateMe) // Debe ir ANTES de PUT /users/:id (si no, Express tomaria "me" como un id)
server.put('/users/password', isAuth, changePasswordRules, validate, updatePassword)
server.delete('/users/me', isAuth, deleteUser)
server.get('/me/library', isAuth, getMyLibrary) //Biblioteca: favoritos y jugados recientemente

// Rutas de Juegos
server.get('/games', getGames);
server.get('/games/mine', isAuth, getMyGames);
server.get('/games/:id', optionalAuth, getGameById);
server.post('/games/:id/favorite', isAuth, addFavorite);     // Guardar en favoritos
server.delete('/games/:id/favorite', isAuth, removeFavorite); // Quitar de favoritos
server.post('/games/:id/play', optionalAuth, playGame);      // Jugar (suma una jugada)
server.post('/games', isAuth, createGameRules, validate, createGame);
server.put('/games/:id', isAuth, isOwnerOrAdmin(Game), updateGameRules, validate, updateGame);
server.delete('/games/:id', isAuth,isOwnerOrAdmin(Game), deleteGame);

// RUTAS EXCLUSIVAS DE ADMIN (Única declaración de GET /users)
server.get('/users', isAuth, requireRole('admin'), getUsers);
server.delete('/users/:id', isAuth, requireRole('admin'), deleteUser);
server.put('/users/:id', isAuth, requireRole('admin'), updateUserByAdmin);

server.use(userRoutes);

server.listen(3000, async () => {
    await sequelize.sync({ force: false, alter: true })
    console.log("El server esta corriendo en el puerto 3000");
})