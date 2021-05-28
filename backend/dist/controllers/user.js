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
var fs_1 = require("fs");
var multer = require("multer");
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.listAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, user_1.default.find()];
                case 1:
                    users = _a.sent();
                    //Send the users object
                    return [2 /*return*/, res.send(users)];
            }
        });
    }); };
    UserController.getOneById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            id = req.params.id;
            //Get the user from database
            user_1.default.findById(id, function (err, user) {
                return err
                    ? res.status(404).send('User not found')
                    : res.status(200).send(user);
            });
            return [2 /*return*/];
        });
    }); };
    UserController.editUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, email, firstname, lastname, profile, user;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    id = req.params.id;
                    _a = req.body, email = _a.email, firstname = _a.firstname, lastname = _a.lastname, profile = _a.profile;
                    return [4 /*yield*/, user_1.default.findById(id).exec()];
                case 1:
                    user = _c.sent();
                    if (!user)
                        return [2 /*return*/, res.status(404).send()];
                    if (!user._id.equals(res.locals.jwtPayload.userId))
                        return [2 /*return*/, res.status(403).send()];
                    // Remove the old profile picture if the old profile picture is an uploaded picture
                    if (!((_b = user.profile) === null || _b === void 0 ? void 0 : _b.toLowerCase().startsWith('http')) && profile) {
                        try {
                            fs_1.unlinkSync('uploads/' + user.profile);
                        }
                        catch (err) {
                            return [2 /*return*/, res.status(500).send("Can't remove the old uploaded file")];
                        }
                    }
                    //Validate the new valuexs on model
                    user.email = email !== null && email !== void 0 ? email : user.email;
                    user.profile = profile !== null && profile !== void 0 ? profile : user.profile;
                    user.firstname = firstname !== null && firstname !== void 0 ? firstname : user.firstname;
                    user.lastname = lastname !== null && lastname !== void 0 ? lastname : user.lastname;
                    try {
                        user.save();
                    }
                    catch (e) {
                        return [2 /*return*/, res.status(409).send()];
                    }
                    //After all send a 204 (no content, but accepted) response
                    return [2 /*return*/, res.status(204).send()];
            }
        });
    }); };
    UserController.deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    return [4 /*yield*/, user_1.default.findByIdAndDelete(id).exec()];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, res.status(404).send()];
                    if (user._id.equals(res.locals.jwtPayload.userId))
                        return [2 /*return*/, res.status(403).send()];
                    //After all send a 204 (no content, but accepted) response
                    return [2 /*return*/, res.status(204).send()];
            }
        });
    }); };
    UserController.search = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var query, users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = req.body.query;
                    if (!query)
                        return [2 /*return*/, res.status(400).send("Missing 'query' params")];
                    return [4 /*yield*/, user_1.default.find({ $text: { $search: query } }).exec()];
                case 1:
                    users = _a.sent();
                    return [2 /*return*/, res.status(200).send(users)];
            }
        });
    }); };
    UserController.upload = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user, storage, upload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = res.locals.jwtPayload.userId;
                    return [4 /*yield*/, user_1.default.findById(userId).exec()];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, res.status(404).send()];
                    if (!user._id.equals(res.locals.jwtPayload.userId))
                        return [2 /*return*/, res.status(403).send()];
                    storage = multer.diskStorage({
                        destination: 'uploads/',
                        filename: function (_req, _res, cb) {
                            cb(null, userId);
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
                                    return [4 /*yield*/, user_1.default.findOneAndUpdate({ _id: userId }, {
                                            $set: {
                                                profile: file.filename,
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
    return UserController;
}());
exports.default = UserController;
//# sourceMappingURL=user.js.map