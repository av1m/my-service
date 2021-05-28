"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var express = require("express");
var helmet = require("helmet");
var cors = require("cors");
var routes_1 = require("./routes");
var config = require("./config/config");
// Connects to the Database -> then starts the express
config.InitiateMongoServer();
// Create a new express application instance
var app = express();
// Call midlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Set all routes from routes folder
app.use('/', routes_1.default);
// Serve static files
app.use('/static', express.static('uploads'));
app.listen(process.env.PORT || 3000, function () {
    console.log('Server started on port 3000! 👂');
});
//# sourceMappingURL=index.js.map