// Ajout du module express au notre fichier
const express   = require('express');
const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');

// Utilisation du Router du module express
const Router = express.Router();

// Import des middlewares
const middlewares   = require('../middlewares');
const User          = require('../models/User');

// Import des models
const UserModel = require('../models/User');

// GET: /api/logout
Router.get('/me', middlewares.auth, (req, res, next) => {
    console.log('me')
});

// Export du module pour pouvoir l'intégrer dans le require
module.exports = Router;