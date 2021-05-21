import {Router} from 'express';
import {checkJwt} from '../middlewares/checkJwt';
import TagsController from '../controllers/tags';

const router = Router();

router.all('*', checkJwt);

router.route('/').get([], TagsController.getAll);

export default router;
