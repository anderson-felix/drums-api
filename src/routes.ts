import { Router } from 'express';

import SessionController from './controllers/SessionController';
import auth from './middlewares/auth';

const routes = Router();

routes.post('/register', SessionController.store);
routes.post('/session', SessionController.login);

routes.use(auth); // All routes authenticated from here

routes.put('/session', SessionController.update);

export default routes;
