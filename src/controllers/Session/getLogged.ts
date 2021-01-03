import { Request, Response } from 'express';

import { userModel } from '../../models/userModel';

//essa função busca um usuario no banco pelo id, e retorna caso o nome e email caso o usuario exista
export const getLogged = async (req: Request, res: Response) => {
  const userDoc = await userModel.findById(req.userId).exec();
  if (!userDoc) throw new Error('USER_NOT_FOUND');
  res.json({
    name: userDoc.name,
    email: userDoc.email,
  });
};
