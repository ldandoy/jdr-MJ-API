require('dotenv').config()

// Import des librairies
const express 		= require('express');
const cors 			= require('cors');
const morgan 		= require('morgan');
const helmet 		= require('helmet');
const cookieParser	= require('cookie-parser');

const refreshTokens = [];
const port = process.env.PORT || 3000;

// Import des routes
const middlewares 		= require('./middlewares')
const senariosRoutes 	= require('./routes/senario');
const authRoutes 		= require('./routes/auth');
const userRoutes		= require('./routes/user');

// Connection à la base de données
middlewares.connectDB();

// Démarrage de l'application
const app = express();

// Configuration du seveur
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors({
	credentials: true,
	origin: `http://localhost:3000`
}));
app.use(cookieParser());
app.use(express.json());

// Route par défault
app.get('/', (req, res) => {
    res.json({message: "Hello World !"});
});

app.use('/api/senarios', 	senariosRoutes);
app.use('/api/users',		userRoutes)
app.use('/api/', 			authRoutes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// Lancement du serveur
app.listen(port, () => {
    console.log(`The server is run on http://localhost:${port}`)
});