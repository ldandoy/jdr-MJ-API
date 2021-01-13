// Ajout du module express au notre fichier
const express = require('express');

// Utilisation du Router du module express
const Router = express.Router();

const senarioModel = require('../models/Senario');

// POST: /api/senarios
Router.post('/senarios', (req, res, next) => {
    console.log(req.body);
    
    const senario = new senarioModel({
        title:          req.body.title,
        description:    req.body.description,
        universe:       req.body.universe,
        picture:        null
    });

    senario.save()
    .then(senario => {
        res.status('200').json(senario);
    })
    .catch(error => {
        next(error);
    });
});

// GET: /api/senarios
Router.get('/senarios', (req, res, next) => {
    senarioModel.find()
    .then(senarios => {
        res.status('200').json(senarios);
    })
    .catch(error => {
        next(error);
    });
});

// DELETE: /api/senarios/:id
Router.delete('/senarios/:id', (req, res, next) => {
    senarioModel.remove({
        "_id": req.params.id
    })
    .exec()
    .then(senario => {
        res.status('200').json({"message": "Sénario bien supprimé !"});
    })
    .catch(error => {
        next(error);
    });
});

// PATCH: http://localhost:4500/db/todos/{todoId}
Router.patch('/senarios/:id', (req, res, next) => {
    data = {};

    if (req.body.title) { data['title'] = req.body.title; }
    if (req.body.description) { data['description'] = req.body.description; }
    if (req.body.universe) { data['universe'] = req.body.universe; }
    if (req.body.picture) { data['picture'] = req.body.picture; }

    senarioModel.updateOne({
        "_id": req.params.id
    },{
        $set: data
    })
    .exec()
    .then(senario => {
        res.status('200').json({"message": "Sénario bien mis à jour !"});
    })
    .catch(error => {
        next(error);
    });
});

// GET: http://localhost:4500/db/todos/{todoId}
Router.get('/senarios/:id', (req, res, next) => {
    senarioModel.findOne({
        "_id" : req.params.id
    })
    .exec()
    .then(senario => {
        res.status('200').json(senario);
    })
    .catch(error => {
        next(error);
    });
});

// Export du module pour pouvoir l'intégrer dans le require
module.exports = Router;