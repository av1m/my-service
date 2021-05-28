"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var payment_1 = require("../controllers/payment");
var user_1 = require("../controllers/user");
var checkJwt_1 = require("../middlewares/checkJwt");
var checkObjectId_1 = require("../middlewares/checkObjectId");
var router = express_1.Router();
// Search
router.post('/search', user_1.default.search);
router.all('*', checkJwt_1.checkJwt);
// Redirect the current user to 'user by id' specifying his ID
router.all('/me/', function (_req, res) {
    return res.redirect(307, '/user/' + res.locals.jwtPayload.userId);
});
// All users
router.route('/').get([], user_1.default.listAll);
// Upload picture
router.post('/upload/', user_1.default.upload);
// Payments
router
    .route('/payment')
    .post([checkObjectId_1.checkObjectId], payment_1.default.add)
    .get([], payment_1.default.get);
// User by ID
router
    .route('/:id/')
    .get([checkObjectId_1.checkObjectId], user_1.default.getOneById)
    .patch([checkObjectId_1.checkObjectId], user_1.default.editUser)
    .delete([checkObjectId_1.checkObjectId], user_1.default.deleteUser);
exports.default = router;
//# sourceMappingURL=user.js.map