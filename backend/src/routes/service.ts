import {Router} from 'express';
import {checkJwt} from '../middlewares/checkJwt';

const router = Router();

router.all('*', checkJwt);

export default router;
