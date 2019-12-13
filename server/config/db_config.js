const Sequelize = require('sequelize');
mysql = require('mysql');

// connection configurations
var dbConn = {
    host: 'localhost',
    user: 'eirini',
    password: '123',
    database: 'theaterdb',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
};

const sequelize = new Sequelize(dbConn.database, dbConn.username, dbConn.password, {
    host: dbConn.host,
    dialect: dbConn.dialect,
    operatorsAliases: false, 
    pool: {
      max: dbConn.max,
      min: dbConn.pool.min,
      acquire: dbConn.pool.acquire,
      idle: dbConn.pool.idle
    }
  });
   
dbConn.Sequelize = Sequelize;
dbConn.sequelize = sequelize;
   
dbConn.user = require('../models/user.js')(sequelize, Sequelize);
dbConn.role = require('../models/role.js')(sequelize, Sequelize);
   
dbConn.role.belongsToMany(dbConn.user, { through: 'user_roles', foreignKey: 'roleId', otherKey: 'userId'});
dbConn.user.belongsToMany(dbConn.role, { through: 'user_roles', foreignKey: 'userId', otherKey: 'roleId'});
   
module.exports = dbConn;
