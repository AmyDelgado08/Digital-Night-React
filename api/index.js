const express = require('express')

const { getUsers, registerUser, login, me, getUserById, updateUser , deleteUser } = require('./controllers/user')
const { getGames, getGameById, createGame, updateGame, deleteGame } = require('./controllers/game')
const { isAuth , isAdmin} = require('./middlewares/auth')
const sequelize = require('./config/db')

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
server.get('/users/:id', isAuth, getUserById)
server.put('/users/update', isAuth, updateUser)
server.delete('/users/me', isAuth, deleteUser) 

// Rutas de Juegos
server.get('/games', getGames);
server.get('/games/:id', getGameById);
server.post('/games', isAuth, createGame);
server.put('/games/:id', isAuth, updateGame);
server.delete('/games/:id', isAuth, deleteGame);

// RUTAS EXCLUSIVAS DE ADMIN (Única declaración de GET /users)
server.get('/users', isAuth, isAdmin, getUsers);
server.delete('/users/:id', isAuth, isAdmin, deleteUser);

server.listen(3000, async () => {
    await sequelize.sync({ force: false })
    console.log("El server esta corriendo en el puerto 3000");
})