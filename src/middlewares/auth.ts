import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import { authToken } from '../utils/authToken';
import { userModel } from '../models/userModel';

declare module 'express-serve-static-core' {
  export interface Request {
    // Habilitando o uso do req.userId
    userId: any;
  }
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { token }: any = cookie.parse(req.headers.cookie || ''); //salvando e parseando o token como um cookie no server side

  if (!token) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  try {
    const decoded: any = jwt.verify(token, authToken.secret);

    const { userId } = decoded;

    const userDoc = await userModel.findById(userId).exec();

    if (!userDoc) throw new Error('INVALID_USER');

    req.userId = userId;

    return next();
  } catch (err) {
    res.clearCookie('token');
    return res.status(401).json({ error: err.message });
  }
};
