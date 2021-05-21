import {Router} from 'express';
import {checkJwt} from '../middlewares/checkJwt';
import ServiceController from '../controllers/service';
import {checkObjectId} from '../middlewares/checkObjectId';
import {checkRight} from '../middlewares/checkRight';

const router = Router();

router.all('*', checkJwt);

router.route('/').post([], ServiceController.create);

// User by ID
router
  .route('/:id/')
  .get([checkObjectId], ServiceController.getById)
  .patch([checkObjectId, checkRight], ServiceController.updateById)
  .delete([checkObjectId, checkRight], ServiceController.deleteById);

router.get('/random/:count/', [], ServiceController.getRandom);

router.post(
  '/upload/:id',
  [checkObjectId, checkRight],
  ServiceController.upload
);

export default router;
