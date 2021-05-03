// Ajout du module express au notre fichier
const express   = require('express');
const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');

// Import des middlewares
const middlewares   = require('../middlewares');
const User          = require('../models/User');

// Import des models
const UserModel = require('../models/User');

// Utilisation du Router du module express
const Router = express.Router();

// POST: /api/register
Router.post('/register', (req, res, next) => {
    if (middlewares.checkRegister(req.body)) {
        UserModel.find({
            email: req.body.email
        })
        .then(user => {
            if (user.length >= 1) {
                next({message: 'Email et mot de passe incorrect', status: "error"});
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        next({message: 'Email et mot de passe incorrect', status: "error"});
                    }else {
                        const user = new UserModel({
                            email: req.body.email,
                            password: hash
                        });

                        user.save()
                        .then(user => {
                            user.password = null
                            res.status(200).json({message: "Enregistrement ok !", status: "success"});
                        })
                        .catch(error => {
                            next({message: 'Email et mot de passe incorrect', status: "error"});
                        });
                    }
                })
            }
        })
        .catch(error => {
            next(error)
        });
    } else {
        next({message: "Email et mot de passe incorrect", status: "error"});
    }
});

// POST: /api/login
Router.post('/login', (req, res, next) => {
    if (middlewares.checkLogin(req.body)) {
        UserModel.findOne({
            email: req.body.email
        })
        .then(user => {
            if (user == null) {
                next({'message': "Email et mot de passe incorrect", status: "error"})
            } else {
                bcrypt.compare(req.body.password, user.password, (error, result) => {
                    if (error) {
                        next(error)
                    }

                    const accessToken = jwt.sign({
                        id:     user._id,
                        email:  user.email
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1h"
                    })

                    const refreshToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);

                    res.status(200);
                    res.cookie('jwt', accessToken, {
                        sameSite: 'strict',
                        path: '/',
                        expires: new Date(new Date().getTime() + 5 * 1000),
                        httpOnly: true,
                        secure: true
                    });
                    res.cookie('jwt-refresh', refreshToken, {
                        sameSite: 'strict',
                        path: '/',
                        expires: new Date(new Date().getTime() + 5 * 1000000),
                        httpOnly: true,
                        secure: true
                    });
                    res.send({
                        accessToken,
                        refreshToken,
                        status: "success"
                    });
                })
            }
        })
        .catch(error => {
            next(error)
        });
    } else {
        next({'message': "Email et mot de passe incorrect", status: "error"});
    }
});

// POST: /api/refreshtoken
Router.post('/refreshtoken', (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });

        res.json({
            accessToken
        });
    });
})

// GET: /api/logout
Router.post('/logout', (req, res, next) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(token => t !== token);
    res.status(200).clearCookie('jwt').send('Logout')
});

// Export du module pour pouvoir l'intégrer dans le require
module.exports = Router;