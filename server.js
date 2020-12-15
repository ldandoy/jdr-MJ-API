require('dotenv').config()

// Import des librairies
const mongoose 	= require('mongoose')
const express 	= require('express');
const cors 		= require('cors');
const morgan 	= require('morgan');
const helmet 	= require('helmet');

// Import des routes
const senariosRoutes = require('./routes/senario');

// Connection à la base de données
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

// Démarrage de l'application
const middlewares = require('./middlewares')
const app = express();

// Configuration du seveur
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

// Route par défault
app.get('/', (req, res) => {
    res.json({message: "Hello World !"});
});

app.use('/api/', senariosRoutes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// Lancement du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`The server is run on http://localhost:${port}`)
});