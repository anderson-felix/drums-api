import { Request, Response } from 'express';
import * as yup from 'yup';

import { mediaModel } from '../../models/mediaModel';
import { userModel } from '../../models/User';

export const create = async (req: Request, res: Response) => {
  const schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    duration: yup.number().required('Duration is required'),
    urlS3: yup.string().required('UrlS3 is required'),
    price: yup.number().required('Price is required'),
    disponible: yup.boolean().required('Disponible is required'),
    image: yup.string(),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (error) {
    return res.status(400).json(error);
  }
  const { title, duration, urlS3, price, disponible, image } = req.body;
  const user = await userModel.findById(req.userId).exec();
  if (!user) {
    throw new Error('Unauthorized user');
  }

  const data = {
    userId: user._id,
    title,
    duration,
    urlS3,
    price,
    disponible,
    image,
  };

  const media = new mediaModel();

  Object.assign(media, data);

  const storeMedia = await mediaModel.create(media);
  await storeMedia.save();
  return res.json({
    _id: storeMedia._id,
    media: storeMedia.title,
    author: user.name,
    disponible: storeMedia.disponible,
    price: storeMedia.price,
  });
};
