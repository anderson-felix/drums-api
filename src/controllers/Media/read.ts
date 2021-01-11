import { Request, Response } from 'express';

import { mediaModel } from '../../models/mediaModel';
import { userModel } from '../../models/userModel';

export const read = async (req: Request, res: Response) => {
  const user = await userModel.findById(req.userId).exec();
  if (!user) {
    return res.status(401).json({ error: 'User invalid' });
  }
  const user_id = user._id;

  const media = await mediaModel.find({ userId: user_id }).exec();
  if (!media) {
    return res.status(401).json({ error: 'Media invalid' });
  }

  return res.json(media);
};
