import {Request, Response, Router} from 'express';
import UserController from '../controllers/UserController';
import {UserRole} from '../entity/User';
import {checkJwt} from '../middlewares/checkJwt';
import {checkRole} from '../middlewares/checkRole';

const router = Router();

router.all('*', checkJwt);

// Redirect the current user to 'user by id' specifying his ID
router.all('/me/', (req: Request, res: Response) =>
  res.redirect(307, '/user/' + res.locals.jwtPayload.userId)
);

// All users
router
  .route('/')
  .get([checkRole([UserRole.ADMIN])], UserController.listAll)
  .post([checkRole([UserRole.ADMIN])], UserController.newUser);

// User by ID
router
  .route('/:id/')
  .get(
    [checkRole([UserRole.ADMIN, UserRole.EDITOR])],
    UserController.getOneById
  )
  .patch(
    [checkRole([UserRole.EDITOR, UserRole.ADMIN])],
    UserController.editUser
  )
  .delete([checkRole([UserRole.ADMIN])], UserController.deleteUser);

export default router;
