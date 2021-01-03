import { Request, Response } from 'express';
import * as yup from 'yup';
import jwt from 'jsonwebtoken';

import { userModel } from '../../models/userModel';
import { authToken } from '../../utils/authToken';

export const login = async (req: Request, res: Response) => {
  const { email, password, keepLogged } = req.body;

  const schema = yup.object().shape({
    email: yup
      .string()
      .email('This email is invalid')
      .required('Email is required'),
    password: yup.string().required('Password required'),
  });

  const data = {
    email,
    password,
  };
  await schema.validate(data, { abortEarly: false });

  const user = await userModel.findOne({ email }).exec();
  if (!user) {
    return res.status(400).json({ error: 'User not exists' });
  }

  if (!(await user.check(password))) {
    return res.status(400).json({ error: 'Password invalid' });
  }

  const token = jwt.sign({ userId: user._id.toString() }, authToken.secret, {
    expiresIn: keepLogged ? '24h' : '1h',
  });

  res.cookie('token', token, { maxAge: 90000000, httpOnly: true });

  return res.status(201).json({
    email: user.email,
    name: user.name,
  });
};
