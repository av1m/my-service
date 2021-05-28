"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("../model/user");
var service_1 = require("../model/service");
var fs_1 = require("fs");
var multer = require('multer');
var ServiceController = /** @class */ (function () {
    function ServiceController() {
    }
    ServiceController.getById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, returnUserId;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = req.params.id;
                    returnUserId = ((_a = req.query.returnUserId) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase()) === 'true';
                    //Get the user from database
                    return [4 /*yield*/, user_1.default.find({
                            'services._id': id,
                        }, { 'services.$': 1 }, null, function (err, result) {
                            var _a;
                            return err || !result[0]
                                ? res.status(404).send('Service not found')
                                : res
                                    .status(200)
                                    .send(returnUserId ? result[0] : (_a = result[0]) === null || _a === void 0 ? void 0 : _a.services);
                        }).exec()];
                case 1:
                    //Get the user from database
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    ServiceController.updateById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, serviceId, user, service;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    userId = res.locals.jwtPayload.userId;
                    serviceId = req.params.id;
                    return [4 /*yield*/, user_1.default.find({ 'services._id': serviceId }).exec()];
                case 1:
                    user = _j.sent();
                    if (!user)
                        return [2 /*return*/, res.status(404).send('Service not found')];
                    service = (_b = (_a = user[0]) === null || _a === void 0 ? void 0 : _a.services) === null || _b === void 0 ? void 0 : _b.filter(function (service) { return service._id.toString() === serviceId; })[0];
                    if (!service)
                        return [2 /*return*/, res.status(404).send('Service not found')];
                    // Remove the old photo picture if the old picture is an uploaded picture
                    if (!((_c = service.photo) === null || _c === void 0 ? void 0 : _c.toLowerCase().startsWith('http')) && req.body.photo) {
                        try {
                            fs_1.unlinkSync('uploads/' + service.photo);
                        }
                        catch (err) {
                            return [2 /*return*/, res.status(500).send("Can't remove the old uploaded file")];
                        }
                    }
                    service.description = (_d = req.body.description) !== null && _d !== void 0 ? _d : service.description;
                    service.photo = (_e = req.body.photo) !== null && _e !== void 0 ? _e : service.photo;
                    service.name = (_f = req.body.name) !== null && _f !== void 0 ? _f : service.name;
                    service.price = (_g = req.body.price) !== null && _g !== void 0 ? _g : service.price;
                    service.tags = (_h = req.body.tags) !== null && _h !== void 0 ? _h : service.tags;
                    return [4 /*yield*/, user_1.default.findOneAndUpdate({ _id: userId, 'services._id': serviceId }, {
                            $set: {
                                // Meaby... it dont work
                                'services.$': service,
                            },
                        }).exec()];
                case 2:
                    if (_j.sent())
                        return [2 /*return*/, res.status(200).send()];
                    return [2 /*return*/, res.status(400).send()];
            }
        });
    }); };
    ServiceController.deleteById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    return [4 /*yield*/, user_1.default.updateOne({ 'services._id': id }, { $pull: { services: { _id: id } } })
                            .then(function (result) {
                            if (!result || result.nModified < 0)
                                return res.status(406).send();
                            //After all send a 204 (no content, but accepted) response
                            return res.status(204).send();
                        })
                            .catch(function () { return res.status(406).send(); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    ServiceController.create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, _a, name, description, price, tags, user, service;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    userId = res.locals.jwtPayload.userId;
                    _a = req.body, name = _a.name, description = _a.description, price = _a.price, tags = _a.tags;
                    return [4 /*yield*/, user_1.default.findById(userId).exec()];
                case 1:
                    user = _c.sent();
                    service = new service_1.default();
                    service.name = name;
                    service.description = description;
                    service.tags = tags;
                    service.price = price;
                    if (!user || user === undefined) {
                        return [2 /*return*/, res.status(404).send()];
                    }
                    if ((((_b = user.services) === null || _b === void 0 ? void 0 : _b.push(service)) || 0) <= 0) {
                        return [2 /*return*/, res.status(500).send()];
                    }
                    return [4 /*yield*/, user
                            .save()
                            .then(function (user) {
                            return res.status(201).send({ service: service, user: user });
                        })
                            .catch(function (err) {
                            return res.status(400).send(err);
                        })];
                case 2: return [2 /*return*/, _c.sent()];
            }
        });
    }); };
    ServiceController.upload = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, serviceId, storage, upload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = res.locals.jwtPayload.userId;
                    serviceId = req.params.id;
                    return [4 /*yield*/, user_1.default.find({ 'services._id': serviceId }).exec()];
                case 1:
                    if (!(_a.sent())) {
                        return [2 /*return*/, res.status(404).send('Service not found')];
                    }
                    storage = multer.diskStorage({
                        destination: 'uploads/',
                        filename: function (_req, _res, cb) {
                            cb(null, serviceId);
                        },
                    });
                    upload = multer({
                        storage: storage,
                    }).single('image');
                    upload(req, res, function (err) { return __awaiter(void 0, void 0, void 0, function () {
                        var file;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (err)
                                        return [2 /*return*/, res.status(500).send()];
                                    file = req.file;
                                    if (!(file === null || file === void 0 ? void 0 : file.mimetype.toLowerCase().startsWith('image'))) {
                                        return [2 /*return*/, res.status(415).send('Only image')];
                                    }
                                    // Update the field photo
                                    return [4 /*yield*/, user_1.default.findOneAndUpdate({ _id: userId, 'services._id': serviceId }, {
                                            $set: {
                                                // Meaby... it dont work
                                                'services.$.photo': file.filename,
                                            },
                                        }).exec()];
                                case 1:
                                    // Update the field photo
                                    _a.sent();
                                    return [2 /*return*/, res.status(204).send()];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    }); };
    ServiceController.getRandom = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var count, userId, users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    count = req.params.count;
                    userId = res.locals.jwtPayload.userId;
                    try {
                        count = Number.parseInt(count);
                        if (count < 0)
                            return [2 /*return*/, res.status(400).send()];
                    }
                    catch (error) {
                        return [2 /*return*/, res.status(400).send()];
                    }
                    return [4 /*yield*/, user_1.default.aggregate([{ $sample: { size: count } }])];
                case 1:
                    users = (_a.sent()).filter(function (user) { var _a; return (((_a = user.services) === null || _a === void 0 ? void 0 : _a.length) || -1) > 0 && !user._id.equals(userId); });
                    return [2 /*return*/, res.status(200).json(users)];
            }
        });
    }); };
    return ServiceController;
}());
exports.default = ServiceController;
//# sourceMappingURL=service.js.map