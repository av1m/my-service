"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var checkJwt_1 = require("../middlewares/checkJwt");
var tags_1 = require("../controllers/tags");
var router = express_1.Router();
router.all('*', checkJwt_1.checkJwt);
router.route('/').get([], tags_1.default.getAll);
exports.default = router;
//# sourceMappingURL=tags.js.map