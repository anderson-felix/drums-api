import { Router } from 'express';

import * as SessionController from './controllers/Session';
import * as MediaController from './controllers/Media';
import auth from './middlewares/auth';

const routes = Router();

routes.post('/register', SessionController.store);

routes.post('/session', SessionController.login);
routes.get('/session', auth, SessionController.getLogged);
routes.put('/session', auth, SessionController.update);

routes.post('/logout', auth, SessionController.Logout);

routes.post('/media', auth, MediaController.create);
routes.put('/media/:id', auth, MediaController.update);
routes.get('/media', auth, MediaController.read);
routes.delete('/media/:track', auth, MediaController._delete);

export default routes;
