const Sequelize = require('sequelize')

const sequelize = new Sequelize('repaso', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  port: 3306
});

module.exports = sequelize