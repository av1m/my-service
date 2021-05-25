import {Request, Response, Router} from 'express';
import PaymentController from '../controllers/payment';
import UserController from '../controllers/user';
import {checkJwt} from '../middlewares/checkJwt';
import {checkObjectId} from '../middlewares/checkObjectId';

const router = Router();

// Search
router.post('/search', UserController.search);

router.all('*', checkJwt);

// Redirect the current user to 'user by id' specifying his ID
router.all('/me/', (_req: Request, res: Response) =>
  res.redirect(307, '/user/' + res.locals.jwtPayload.userId)
);

// All users
router.route('/').get([], UserController.listAll);

// Upload picture
router.post('/upload/', UserController.upload);

// Payments
router
  .route('/payment')
  .post([checkObjectId], PaymentController.add)
  .get([], PaymentController.get);

// User by ID
router
  .route('/:id/')
  .get([checkObjectId], UserController.getOneById)
  .patch([checkObjectId], UserController.editUser)
  .delete([checkObjectId], UserController.deleteUser);

export default router;
