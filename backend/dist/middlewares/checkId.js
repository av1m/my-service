"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkId = void 0;
var ObjectId = require('mongoose').Types.ObjectId;
var checkId = function (req, res, next) {
    var id = req.params.id;
    return ObjectId.isValid(id) ? next() : res.status(400).send('Invalid ID');
};
exports.checkId = checkId;
//# sourceMappingURL=checkId.js.map