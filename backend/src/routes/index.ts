import {Router} from 'express';
import auth from './auth';
import service from './service';
import user from './user';

const routes = Router();

// Only for debug
routes.use('/', (req, res, next) => {
  console.log('-------------------------');
  console.log(`${req.method} - ${req.url}`);
  console.log(req.body);
  console.log(req.headers);
  next();
});

routes.use('/account', auth);
routes.use('/user', user);
routes.use('/service', service);

export default routes;
