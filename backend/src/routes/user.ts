import {Request, Response, Router} from 'express';
import UserController from '../controllers/UserController';
import {UserRole} from '../entity/User';
import {checkJwt} from '../middlewares/checkJwt';
import {checkRole} from '../middlewares/checkRole';

const router = Router();

//Get all users
router
  .route('/')
  .get([checkJwt, checkRole([UserRole.ADMIN])], UserController.listAll)
  .post([checkJwt, checkRole([UserRole.ADMIN])], UserController.newUser);

router.all('/me/', [checkJwt], (req: Request, res: Response) =>
  res.redirect('/user/' + res.locals.jwtPayload.userId)
);

// Get one user
router
  .route('/:id/')
  .get(
    [checkJwt, checkRole([UserRole.ADMIN, UserRole.EDITOR])],
    UserController.getOneById
  )
  .patch(
    [checkJwt, checkRole([UserRole.EDITOR, UserRole.ADMIN])],
    UserController.editUser
  )
  .delete([checkJwt, checkRole([UserRole.ADMIN])], UserController.deleteUser);

export default router;
