const express = require('express')
const users = express.Router()
const jwt = require('jsonwebtoken')
const fs = require('fs')

const db = require('../models');
const User = db.users;

process.env.SECRET_KEY = 'secret'

users.post('/login', (req, res) => {
    var datetime = new Date();
    console.log(datetime);
    console.log(req.body)
    User.findOne({
        where: {
        email: req.body.email
        }
    })
  .then(user => {
    if (user) {
      console.log("user values", user.dataValues);
      if (req.body.password=== user.dataValues.password) {
        var LoginData = user.dataValues.email + '  ' + datetime + '\n'
        fs.appendFile('./server/logs/logFile', LoginData, function (err) {
        if (err) throw err;
          console.log('Saved!');
        });
        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
            expiresIn: 1440
        })
        res.send(token)
      }
      else{
        res.status(400).send({ message: "Wrong password" })
      }
    } else {
        res.status(401).send({ message: "User doesnt exists" })
      }
    }) 
    .catch(err => {
      res.status(400).send(err);
    })
})

module.exports = users