import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import * as SessionController from './controllers/User';
import * as MediaController from './controllers/Media';

import UserController from './controllers/User/UserController';
import auth from './middlewares/auth';

const routes = Router();
const userController = new UserController();

routes.post('/register', userController.create); //OK

routes.post('/session', SessionController.login);
routes.get('/session', auth, SessionController.getLogged);
routes.put('/session', auth, SessionController.update);

routes.post('/logout', auth, SessionController.Logout);

routes.post('/media', auth, MediaController.create);
routes.put('/media/:id', auth, MediaController.update);
routes.get('/media', auth, MediaController.read);
routes.delete('/media/:track', auth, MediaController._delete);

export default routes;
