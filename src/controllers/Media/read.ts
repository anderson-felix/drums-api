import { Request, Response } from 'express';

import { mediaModel } from '../../models/mediaModel';
import { userModel } from '../../models/userModel';

export const read = async (req: Request, res: Response) => {
  const user = await userModel.findById({ _id: req.userId });
  if (!user) {
    return res.status(401).json({ error: 'User invalid' });
  }
  const user_id = user._id;
  const media_id = await mediaModel.find({ userId: user_id });
  if (!media_id) {
    return res.status(401).json({ error: 'Media invalid' });
  }

  return res.json(media_id);
};
