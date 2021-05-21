import 'reflect-metadata';
import express = require('express');
import helmet = require('helmet');
import cors = require('cors');
import routes from './routes';
import * as config from './config/config';

// Connects to the Database -> then starts the express
config.InitiateMongoServer();

// Create a new express application instance
const app = express();

// Call midlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Set all routes from routes folder
app.use('/', routes);
// Serve static files
app.use('/static', express.static('uploads'));

app.listen(3000, () => {
  console.log('Server started on port 3000! 👂');
});
