import { Router } from 'express';

import * as SessionController from './controllers/Session';
import auth from './middlewares/auth';

const routes = Router();

routes.post('/register', SessionController.store);
routes.post('/session', SessionController.login);

routes.get('/session', auth, SessionController.getLogged);
routes.put('/session', auth, SessionController.update);
routes.post('/logout', auth, SessionController.Logout);

export default routes;
