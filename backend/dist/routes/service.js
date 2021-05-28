"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var checkJwt_1 = require("../middlewares/checkJwt");
var service_1 = require("../controllers/service");
var checkObjectId_1 = require("../middlewares/checkObjectId");
var checkRight_1 = require("../middlewares/checkRight");
var router = express_1.Router();
router.all('*', checkJwt_1.checkJwt);
router.route('/').post([], service_1.default.create);
router
    .route('/:id/')
    .get([checkObjectId_1.checkObjectId], service_1.default.getById)
    .patch([checkObjectId_1.checkObjectId, checkRight_1.checkRight], service_1.default.updateById)
    .delete([checkObjectId_1.checkObjectId, checkRight_1.checkRight], service_1.default.deleteById);
router.get('/random/:count/', [], service_1.default.getRandom);
router.post('/upload/:id', [checkObjectId_1.checkObjectId, checkRight_1.checkRight], service_1.default.upload);
exports.default = router;
//# sourceMappingURL=service.js.map