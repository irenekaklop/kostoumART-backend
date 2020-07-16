const db = require("../models");
const User = db.users;
var jwt = require('jsonwebtoken');
const fs = require('fs');
const { USER } = require("../config/db.sequelize.config");

process.env.SECRET_KEY = 'secret'

exports.signin = (req, res) => {
  var datetime = new Date();
  User.findOne({
    where: {
      email: req.body.email,
    }
  }).then(user => {
    if (user) {
      if (req.body.password === user.dataValues.password) {
        user.dataValues.lastLogin = datetime;
        user.update({
          lastLogin: new Date()
        })
        var LoginData = user.dataValues.email + '  ' + datetime + '\n'
        fs.appendFile('./server/logs/logFile', LoginData, function (err) {
          if (err) throw err;
        });
    
        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
            expiresIn: '7d'
        })
        
        res.setHeader('x-auth', token);
        res.status(200).send(token);
      }
      else{
        console.log(`User ${req.body.email} tried to login, wrong password`)
        res.status(400).send({ message: "Wrong password" })
      }
    } 
    else {
      console.log(`User ${req.body.email} tried to login, user doesn't exists`)
      res.status(404).send({ message: "User doesn't exists" })
    }
    }) 
    .catch(err => {
      res.status(400).send(err);
    })
}