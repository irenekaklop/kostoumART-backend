const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')

const User = require('../models/User');
users.use(cors())

process.env.SECRET_KEY = 'secret'

users.post('/login', (req, res) => {
  console.log(req.body)
  User.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(user => {
    if (user) {
      console.log("user values", user.dataValues.password, req.body.password);
      if (req.body.password=== user.dataValues.password) {
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

users.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  User.findOne({
    where: {
      user_id: decoded.user_id
    }
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

module.exports = users