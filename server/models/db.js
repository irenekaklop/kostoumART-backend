var mysql = require('mysql');
var pool;
const dbConfig = require("../config/db.config.js");

module.exports = {
    getPool: function () {
      if (pool) return pool;
      pool = mysql.createPool({
        host            : dbConfig.host,
        user            : dbConfig.user,
        password        : dbConfig.password,
        database        : dbConfig.database
      });
      return pool;
    }
};