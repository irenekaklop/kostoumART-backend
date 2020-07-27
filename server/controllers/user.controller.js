const db = require("../models");
const User = db.users;
var jwt = require('jsonwebtoken');
const fs = require('fs');
const { USER } = require("../config/db.sequelize.config");

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { response } = require("express");
const e = require("express");

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
      console.error(`User ${req.body.email} tried to login, user doesn't exists`)
      res.status(404).send({ message: "User doesn't exists" })
    }
    }) 
    .catch(err => {
      res.status(400).send(err);
    })
}

exports.sendResetEmail = (req, res) => {
  const email = req.body.email
  User.findOne({
    where: {
      email: email
    }
  })
  .then(user => {
    if(!user){
      console.error(`User ${email} not found with this email address`);
      res.status(404).send({ message: "User doesn't exists" })
    }
    else{
      const token = crypto.randomBytes(20).toString('hex');
      user.update({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 360000,
      });

      var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'kostoumartproject@gmail.com',
            pass: 'kostoumart2020'
        }
      };
      
      var transporter = nodemailer.createTransport(smtpConfig);

      // verify connection configuration
      transporter.verify(function(error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
        }
      });

      const mailOptions = {
        from: 'kostoumartproject@gmail.com',
        to: `${user.email}`,
        subject: 'KostoumArt Platform - Reset Password',
        text: '\nDear User,\n\n' +
        'Click here if you wish to reset your password:\n' +
        'http://localhost:8109/forgotPassword/' + token + 
        '\nIf you did not request this, please ignore this email and your password will remain unchanged\n'
      }

      transporter.sendMail(mailOptions, function(err, response) {
        if(err){
          console.error('At /ResetPassword there was an error:', err);
        }
        else{
          console.log('email sent');
          res.status(200).json('recovery email sent');
        }
      })
    }
  })
}

exports.reset = (req, res) => {
  User.findOne({
    where: {
      resetPasswordToken: req.query.resetPasswordToken,
    }
  })
  .then(user => {
    if(!user){
      console.error(`Reset link is invalid or expired`);
      res.status(404).send({ message: "Reset link is invalid or expired" })
    }
    else{
      res.status(200).send({
        message: 'password reset link ok',
        email: user.email
      })
    }
  })
}

exports.updatePassword = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(user => {
    if(!user){
      console.error('At /updatePassword: no user exists in db to update');
      res.status(404).send({message: 'no user exists in db to update'});
    }
    else{
      user.update({
        password: req.body.password,
        resetPasswordToken: null,
        resetPasswordExpires: null
      })
      .then(()=>{
          console.log(`${user.email} updated their password`);
          res.status(200).send({message: 'password updated'})
      })
    }
  })
}

exports.register = (req, res) => {
  const userData = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: parseInt(req.body.role)
  }

  User.findOne({
    where: {
      email: userData.email
    }
  })
  .then(user => {
    if(user){
      console.error('At /register: user already exists in the db');
      res.status(400).send({message: 'user already exists in db'});
    }
    else{
      User.create(userData)
      .then(response => {
        console.log(`${userData.email} was registered`);
        res.status(200).send({message: 'OK'})
      })
      .catch(error => {
        console.error('At /register: user was not saved in the db', error);
        res.status(404).send({message: 'user was not saved in the db'});
      })
    }
  })
}