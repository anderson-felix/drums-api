import { Request, Response } from 'express';

import { mediaModel } from '../../models/mediaModel';
import { userModel } from '../../models/userModel';

export const _delete = async (req: Request, res: Response) => {
  const user = await userModel.findById(req.userId);
  if (!user) {
    return res.status(401).json({ error: 'Not registered' });
  }
  const user_id = user._id;

  const { track } = req.params;
  const media = await mediaModel.findById(track).exec();
  if (!media) {
    return res.status(400).json({ error: 'Media not exists' });
  }
  if (user_id != media.userId) {
    return res.status(401).json({ error: 'User invalid' });
  }

  try {
    await mediaModel.findByIdAndDelete(track).exec();
  } catch (err) {
    throw new Error(err);
  }

  const mediaName = media.title;
  return res.status(200).json({ deleted: mediaName });
};
