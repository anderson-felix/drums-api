import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import { authToken } from '../utils/authToken';

declare module 'express-serve-static-core' {
  export interface Request {
    // Habilitando o uso do req.userId
    userId: any;
  }
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  const [, token] = authHeader.split(' ');

  try {
    const decoded: any = await promisify(jwt.verify)(token, authToken.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
