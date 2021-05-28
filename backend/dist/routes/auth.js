"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("../controllers/auth");
var checkJwt_1 = require("../middlewares/checkJwt");
var router = express_1.Router();
router.post('/register', auth_1.default.register);
router.post('/login', auth_1.default.login);
router.post('/change-password', [checkJwt_1.checkJwt], auth_1.default.changePassword);
exports.default = router;
//# sourceMappingURL=auth.js.map