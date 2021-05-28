"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwt = void 0;
var jwt = require("jsonwebtoken");
var config_1 = require("../config/config");
var checkJwt = function (req, res, next) {
    //Get the jwt token from the head
    var bearerHeader = req.headers['authorization'];
    if (!bearerHeader)
        return res
            .status(401)
            .send({ error: 'No Authorization found in the headers' });
    var token = bearerHeader.split(' ')[1];
    var jwtPayload;
    // Try to validate the token and get data
    try {
        jwtPayload = jwt.verify(token, config_1.default.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    }
    catch (error) {
        // If token is not valid, respond with 401 (unauthorized)
        return res.status(401).send();
    }
    // The token is valid for 1 day
    // We want to send a new token on every request
    var userId = jwtPayload.userId, email = jwtPayload.email;
    var newToken = jwt.sign({ userId: userId, email: email }, config_1.default.jwtSecret, {
        expiresIn: '1d',
    });
    res.setHeader('token', newToken);
    //Call the next middleware or controller
    return next();
};
exports.checkJwt = checkJwt;
//# sourceMappingURL=checkJwt.js.map