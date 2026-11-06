const User = require('./User')
const Game = require('./GameModel')
const Rating = require('./Rating')
const Comment = require('./Comment')
const Favorite = require('./Favorite')
const PlayHistory = require('./PlayHistory')
const Partida = require('./Partida')
const Jugada = require('./Jugada')

// Un usuario tiene muchos juegos; si se borra el usuario, se borran sus juegos
User.hasMany(Game, { foreignKey: 'authorId', onDelete: 'CASCADE' })
Game.belongsTo(User, { foreignKey: 'authorId' })

// Valoraciones, comentarios, favoritos e historial pertenecen a un usuario y a un juego.
// Si se borra cualquiera de los dos, se borran estos registros.
const dependientes = [Rating, Comment, Favorite, PlayHistory, Partida]

dependientes.forEach((Model) => {
    User.hasMany(Model, { foreignKey: 'userId', onDelete: 'CASCADE' })
    Game.hasMany(Model, { foreignKey: 'gameId', onDelete: 'CASCADE' })
    Model.belongsTo(User, { foreignKey: 'userId' })
    Model.belongsTo(Game, { foreignKey: 'gameId' })
})

// Jugadas por IP: si se borra el juego, se borran sus jugadas
Game.hasMany(Jugada, { foreignKey: 'gameId', onDelete: 'CASCADE' })
Jugada.belongsTo(Game, { foreignKey: 'gameId' })

module.exports = { User, Game, Rating, Comment, Favorite, PlayHistory, Partida, Jugada }