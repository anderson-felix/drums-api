import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';

import CreateUserService from '../../services/users/CreateUserService';

export default class UserController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password, name, birthDate } = req.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      email,
      password,
      name,
      birthDate,
    });

    return res.json(classToClass(user));
  }
}
