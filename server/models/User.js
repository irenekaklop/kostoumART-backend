const Sequelize = require('sequelize')
const db = require('../config/db_config.js')

module.exports = db.sequelize.define(
  'user',
  {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false
  }
)
