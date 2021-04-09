import {Router} from 'express';
import auth from './auth';
import service from './service';
import user from './user';

const routes = Router();

routes.use('/account', auth);
routes.use('/user', user);
routes.use('/service', service);

export default routes;
