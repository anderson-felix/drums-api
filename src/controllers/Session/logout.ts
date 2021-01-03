import { Request, Response } from 'express';

export const Logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.send(200);
};
