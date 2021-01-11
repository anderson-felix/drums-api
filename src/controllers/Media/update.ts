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
  try {
    const media = await mediaModel.findById({ _id: req.params.id });
    if (!media) return res.json({ error: 'Media invalid' });
    const media_id = media.userId;

    const user = await userModel.findById({ _id: media_id });
    if (!user) return res.json({ error: 'User invalid' });
    const user_id = req.userId;

    if (user_id != user._id)
      return res.status(401).json({ error: 'Unauthorized' });

    console.log(media);
  } catch (err: any) {
    res.json({ error: err });
  }

  await mediaModel.findByIdAndUpdate(req.params.id, req.body);

  return res.json({ ok: true });
};
