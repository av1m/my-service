import {Router} from 'express';
import auth from './auth';
import service from './service';
import user from './user';
import tags from './tags';

const routes = Router();

// Only for debug
routes.use('/', (req, res, next) => {
  console.log('-------------------------');
  console.log(`${req.method} - ${req.url}`);
  console.log(req.body);
  console.log(req.headers);
  console.log('#####');
  next();
});

routes.use('/account', auth);
routes.use('/user', user);
routes.use('/service', service);
routes.use('/tags', tags);

export default routes;
