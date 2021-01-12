import { Request, Response } from 'express';
import * as yup from 'yup';

import { mediaModel } from '../../models/mediaModel';
import { userModel } from '../../models/userModel';

export const update = async (req: Request, res: Response) => {
  const schema = yup.object().shape({
    title: yup.string(),
    duration: yup.number(),
    urlS3: yup.string(),
    price: yup.number(),
    disponible: yup.boolean(),
    image: yup.string(),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (error) {
    return res.status(400).json(error);
  }
  const media = await mediaModel.findById(req.params.id).exec();
  if (!media) return res.json({ error: 'Media invalid' });
  const media_id = media.userId;

  const user = await userModel.findById(media_id).exec();
  if (!user) return res.json({ error: 'User invalid' });
  const user_id = req.userId;

  if (user_id != user._id)
    return res.status(401).json({ error: 'Unauthorized' });

  console.log(media);

  const newMedia = await mediaModel
    .findByIdAndUpdate(req.params.id, req.body)
    .exec();

  return res.status(200).json({ updated: newMedia?.title });
};
