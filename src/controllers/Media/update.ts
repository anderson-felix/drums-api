import { Request, Response } from 'express';
import * as yup from 'yup';

import { mediaModel } from '../../models/mediaModel';

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
  const { title, duration, urlS3, price, disponible, image } = req.body;

  const data = {
    title,
    duration,
    urlS3,
    price,
    disponible,
    image,
  };

  const media = new mediaModel();

  return res.json({ ok: true });
};
