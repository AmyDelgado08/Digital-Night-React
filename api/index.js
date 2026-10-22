const express = require('express')

const { getUsers, registerUser, login, me, updateUser, deleteUser, updateUserByAdmin } = require('./controllers/user')
const { getGames, getGameById, createGame, updateGame, deleteGame } = require('./controllers/game')
const { isAuth, requireRole, isOwnerOrAdmin } = require('./middlewares/auth')
const sequelize = require('./config/db')
const Game = require('./models/GameModel')

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
server.post('/users', registerUser)
server.post('/login', login)

// Rutas de Usuario Autenticado
server.get('/me', isAuth, me)
server.put('/users/update', isAuth, updateUser)
server.delete('/users/me', isAuth, deleteUser)

// Rutas de Juegos
server.get('/games', getGames)
server.get('/games/:id', getGameById)
server.post('/games', isAuth, createGame)
server.put('/games/:id', isAuth, isOwnerOrAdmin(Game), updateGame)
server.delete('/games/:id', isAuth, isOwnerOrAdmin(Game), deleteGame)

// RUTAS EXCLUSIVAS DE ADMIN
server.get('/users', isAuth, requireRole('admin'), getUsers)
server.delete('/users/:id', isAuth, requireRole('admin'), deleteUser)
server.put('/users/:id', isAuth, requireRole('admin'), updateUserByAdmin)

server.listen(3000, async () => {
    await sequelize.sync({ force: false, alter: true })
    console.log("El server esta corriendo en el puerto 3000")
})
