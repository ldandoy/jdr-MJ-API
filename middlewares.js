// Remonte les erreurs de route non trouvé
const notFound = (req, res, next) => {
    const error = new Error (`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

// Gére la remonté de toutes les erreurs
const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? "Erreur" : error.stack
    })
}

module.exports = {
    notFound,
    errorHandler
}