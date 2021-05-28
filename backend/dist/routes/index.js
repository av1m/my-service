"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("./auth");
var service_1 = require("./service");
var user_1 = require("./user");
var tags_1 = require("./tags");
var routes = express_1.Router();
// Middleware only for debug
routes.use('/', function (req, res, next) {
    console.log('-------------------------');
    console.log(req.method + " - " + req.url);
    console.log(req.body);
    console.log(req.headers);
    next();
});
routes.use('/account', auth_1.default);
routes.use('/user', user_1.default);
routes.use('/service', service_1.default);
routes.use('/tags', tags_1.default);
exports.default = routes;
//# sourceMappingURL=index.js.map