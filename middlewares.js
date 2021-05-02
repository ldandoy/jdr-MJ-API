const jwt       = require('jsonwebtoken');
const mongoose 	= require('mongoose');

// Gestion de la connection à la bdd
const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
    
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            console.log("Connected !");
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

// Remonte les erreurs de route non trouvé
const notFound = (req, res, next) => {
    const error = new Error (`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

// Gére la remonté de toutes les erreurs
const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.log(error);
    res.status(statusCode);
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? "Erreur" : error.stack
    })
}

// Gestion des données en entrées du form register
const checkRegister = (body) => {
    const email = body.email;
    const email2 = body.email2;

    if (
        JSON.stringify(body) !== '{}' && 
        (email !== undefined && email != "") &&
        (email2 !== undefined && email2 != "") &&
        (email === email2) &&
        (body.password !== undefined && body.password != "") && 
        (body.password2 !== undefined && body.password2 != "") &&
        (body.password === body.password2)
    ) {
         return true;
    } else {
        return false;
    }
}

// Gestion des données en entrées du form Login
const checkLogin = (data) => {
    const { email, password } = data;

    if (
        JSON.stringify(data) !== '{}' && 
        (email !== undefined && email != "") &&
        (password !== undefined && password != "")
    ) {
         return true;
    } else {
        return false;
    }
}

// Vérifie si l'utilisateur est connecté
const auth = async (req, res, next)  => {
    try {
        const token = req.cookies.token || '';
        console.log(token)
        const decrypt = await jwt.verify(token, process.env.JWT_SECRET);
        console.log(decrypt)
    } catch (error) {
        next(error)
    }

}

module.exports = {
    connectDB,
    notFound,
    errorHandler,
    checkRegister,
    checkLogin,
    auth
}