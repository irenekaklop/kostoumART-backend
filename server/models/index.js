const Sequelize = require('sequelize')
const sequelizeConfig = require("../config/db.sequelize.config.js");

const db = {}

const sequelize = new Sequelize(sequelizeConfig.DB, sequelizeConfig.USER, sequelizeConfig.PASSWORD, {
    host: sequelizeConfig.HOST,
    dialect: sequelizeConfig.dialect,
    operatorsAliases: 1,
  
    pool: {
      max: sequelizeConfig.pool.max,
      min: sequelizeConfig.pool.min,
      acquire: sequelizeConfig.pool.acquire,
      idle: sequelizeConfig.pool.idle
    }
  });

// export the main sequelize package with an uppercase 'S' and
// our own sequelize instance with a lowercase 's'
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);

module.exports = db;