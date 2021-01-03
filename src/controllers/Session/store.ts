import { Request, Response } from 'express';
import * as yup from 'yup';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { userModel } from '../../models/userModel';
import { authToken } from '../../utils/authToken';

export const store = async (req: Request, res: Response) => {
  const schema = yup.object().shape({
    email: yup
      .string()
      .email('Email not is valid')
      .required('Email is required'),
    password: yup.string().required('Password required'),
    name: yup.string().required('Name is required'),
    birthDate: yup.string().required('Birth date is required'),
  });
  await schema.validate(req.body, { abortEarly: false });

  const { email, password, name, birthDate } = req.body;
  const password_hash = await bcrypt.hash(password, 10);

  const formatDate = () => {
    const date = new Date();
    return date;
  };

  const register = {
    email: email,
    password: password_hash,
    name: name,
    birthDate: birthDate,
    registered: formatDate(),
  };

  const user = new userModel();
  const userFind = await userModel.findOne({ email }).exec();
  if (userFind) {
    return res.status(400).json({ error: 'User already exists' });
  }
  Object.assign(user, register);
  const data = await userModel.create(user);
  await data.save();

  const token = jwt.sign({ userId: user._id.toString() }, authToken.secret, {
    expiresIn: '24h',
  });

  res.cookie('token', token, { maxAge: 90000000, httpOnly: true });

  return res.json(data);
};
