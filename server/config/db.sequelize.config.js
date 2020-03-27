module.exports = {
    HOST: "localhost",
    USER: "eirini",
    PASSWORD: "e1r1n1",
    DB: 'theaterdb',
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
};
