import {Request, Response, Router} from 'express';
import UserController from '../controllers/user';
import {checkJwt} from '../middlewares/checkJwt';
import {checkObjectId} from '../middlewares/checkObjectId';
import {checkRight} from '../middlewares/checkRight';

const router = Router();

router.all('*', checkJwt);

// Redirect the current user to 'user by id' specifying his ID
router.all('/me/', (_req: Request, res: Response) =>
  res.redirect(307, '/user/' + res.locals.jwtPayload.userId)
);

// All users
router.route('/').get([], UserController.listAll);

// User by ID
router
  .route('/:id/')
  .get([checkObjectId], UserController.getOneById)
  .patch([checkObjectId], UserController.editUser)
  .delete([checkObjectId], UserController.deleteUser);

// Search
router.post('/search', UserController.search);

router.post('/upload/', UserController.upload);

export default router;
