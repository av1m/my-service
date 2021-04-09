import 'reflect-metadata';
import {createConnection} from 'typeorm';
import express = require('express');
import helmet = require('helmet');
import cors = require('cors');
import routes from './routes';
import * as config from './config/config';

// Connects to the Database -> then starts the express
createConnection(config.db)
  .then(async () => {
    // Create a new express application instance
    const app = express();

    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    // Set all routes from routes folder
    app.use('/', routes);

    app.listen(3000, () => {
      console.log('Server started on port 3000!');
    });
  })
  .catch(error => console.log(error));
