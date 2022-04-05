const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Users = require('../models/Users')
const Tokens = require('../models/Tokens');
const auth = require('../middlewares/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  Users.find({})
    .then(response => res.status(200).json(response))
    .catch(err => console.log(err))
});

// CREATE NEW USER
router.post('/signup', async(req, res) => {
  try {
    const { userName, email, password} = req.body

    const userExistName = await Users.find({userName})
    if(userExistName.length > 0) return res.status(401).json('UserName already taken.')
    const userExistEmail = await Users.find({email})
    if(userExistEmail.length > 0) return res.status(401).json('Email already in use.')

    if (userName.length < 3 || password < 6) return res.status(401).json('Requerimientos no cumplidos.')

    const encryptedPassword = await bcrypt.hash(password, 8)
    console.log(encryptedPassword)
    const newUser = await Users.create({userName, email, password: encryptedPassword})

    return res.status(200).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      rol: newUser.rol,
      friends: newUser.friends,
      conversations: newUser.conversations
    })
  } catch (error) {
    return res.status(500).json(error)
  }
})

// LOGIN USER
router.post('/login', async(req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await Users.findOne({userName})
    if(!user) return res.status(401).json('No existe ningún usuario con ese nombre.')

    const decryptedPassword = await bcrypt.compare(password, user.password)
    if(!decryptedPassword) return res.status(401).json('Contraseña incorrecta.')
    
    const generateToken = jwt.sign({id: user._id, rol: user.rol}, process.env.JWT_SECRET)
    const token = await Tokens.create({
      token: generateToken,
      userId: user._id
    })

    return res.status(200).json({user, token: generateToken})
  } catch (error) {
    return res.status(500).json(error)
  }
})

// LOGOUT USER
router.delete('/logout', auth, (req, res) => {
  try {
    Tokens.deleteOne({token: req.token})
      .then(response => response.deletedCount === 1 ? res.status(200).json('Logout completado.') : res.status(500).json('Ha ocurrido algo'))
      .catch(err => res.status(500).json(err))
  } catch (error) {
    return res.status(500).json(error)
  }
})

module.exports = router;
