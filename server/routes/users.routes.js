const controller = require("../controllers/user.controller.js")

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post('/login', controller.signin);
  app.post('/sendResetMail', controller.sendResetEmail);
  app.get('/reset', controller.reset);
  app.post('/updatePassword', controller.updatePassword);
  app.post('/register', controller.register);
}