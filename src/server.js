const http = require("http");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const routes = require('./routes');
// import routes

const app = express();

// Enhance API security
app.use(helmet());
// Parse the body into JS objects
app.use(bodyParser.json());
// Enable CORS for all requests
app.use(cors());
// Logging
app.use(morgan('dev'));

app.get("/", (req, res) => res.send('App is working'));

app.use("/api", routes);

// Default message if route does not exists
app.use((req, res, next) => {
	const error = new Error('not found');
	return res.status(404).json({
		message: error.message
	});
})

const PORT = process.env.PORT ?? 6060;
app.listen(PORT, () => console.log('The server is running on port http://localhost:' + PORT + "/api"));
