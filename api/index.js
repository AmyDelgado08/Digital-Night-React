const express = require('express')

const { getUsers, registerUser, login, me, updateUser, updateMe, deleteUser, updateUserByAdmin} = require('./controllers/user')
const { getGames, getGameById, createGame, updateGame, deleteGame, getMyGames } = require('./controllers/game')
const authRoutes = require('./routes/auth.routes')
const { isAuth , requireRole, isOwnerOrAdmin} = require('./middlewares/auth')
const sequelize = require('./config/db')
const Game = require('./models/GameModel')
const userRoutes = require('./routes/user.routes');
const validate = require('./middlewares/validate')
const { registerRules, loginRules } = require('./validators/user')

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
server.delete('/users/me', isAuth, deleteUser) 

// Rutas de Juegos
server.get('/games', getGames);
server.get('/games/mine', isAuth, getMyGames);
server.get('/games/:id', getGameById);
server.post('/games', isAuth, createGame);
server.put('/games/:id', isAuth,isOwnerOrAdmin(Game), updateGame);
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