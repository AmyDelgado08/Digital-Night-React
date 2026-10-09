const express = require('express')

//importamos todo
const { getUsers, registerUser, login, me, getUserById, updateUser } = require('./controllers/user')
const { isAuth } = require('./middlewares/auth')
const sequelize = require('./config/db')

//inicializamos la app d express
const server = express()

//Le dice a Express q lea e interprete la info
server.use(express.json())

// Middleware para configurar los headers CORS
server.use((req, res, next) => {
  //  Autorizamos unicamente a nuestro frontend local para que haga peticiones
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')

  //  Metodos HTTP permitidos
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

  //  Que headers puede mandar el frontend
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  //  Si queres permitir cookies/tokens en las peticiones
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  // Pre-flight request: Los navegadores hacen una peticion invisible de prueba (OPTIONS) antes de un POST o PUT. Le respondemos "200" rapido para que proceda.
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})


server.get('/users/:id', isAuth, getUserById) //Trae un usuario especifico segun el ID de la URL
server.get('/users', isAuth, getUsers) //Trae la lista completa de usuarios
server.get('/me',isAuth, me) //Trae los datos del usuario dueño del token actual

server.post('/users', registerUser) //Registar a un usuario nuevo
server.post('/login', login) //Para enviar credenciales e iniciar sesion

server.put('/users/update', isAuth, updateUser) //Sobrescribe los datos del perfil del usuario


server.listen(3000, async () => {
    //force: false asegura que si apagas y prendes el servidor, no se borren los usuarios registrados
    await sequelize.sync({ force: false })
    console.log("El server esta corriendo en el puerto 3000");
})
