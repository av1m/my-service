"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkObjectId = void 0;
var ObjectId = require('mongoose').Types.ObjectId;
var checkObjectId = function (req, res, next) {
    var _a;
    var id = (_a = req.params.id) !== null && _a !== void 0 ? _a : req.body.id;
    return ObjectId.isValid(id) ? next() : res.status(400).send('Invalid ID');
};
exports.checkObjectId = checkObjectId;
//# sourceMappingURL=checkObjectId.js.map