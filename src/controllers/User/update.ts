import { Request, Response } from 'express';
import * as yup from 'yup';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { userModel } from '../../models/User';
import { authToken } from '../../utils/authToken';

export const update = async (req: Request, res: Response) => {
  const {
    password,
    newEmail,
    newPassword,
    confirmPassword,
    newName,
    newBirthDate,
  } = req.body;

  const schema = yup.object().shape({
    password: yup.string().required().strict(),
    newEmail: yup.string().email('Email is not valid'),
    newName: yup.string().strict(),
    newBirthDate: yup.string().strict(),
    newPassword: yup
      .string()
      .when('password', (password: string, field: any) => field),
    confirmPassword: yup
      .string()
      .when('newPassword', (newPassword: string, field: any) =>
        newPassword
          ? field
              .required()
              .oneOf([yup.ref('newPassword')], 'Password not confirmed.')
          : field,
      )
      .strict(),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (err) {
    const errorMessages = {};

    if (err instanceof yup.ValidationError) {
      err.inner.forEach(errors => {
        Object.assign(errorMessages, { errors: errors });
      });

      return res.status(400).json(errorMessages);
    }
  }

  var dataView = {};

  const user = await userModel.findById(req.userId).exec();
  if (!user) {
    return res.status(400).json({ error: 'User not exists' });
  }

  const user_id = user._id;

  if (!(await user.check(password))) {
    return res.status(400).json({ error: 'Password invalid' });
  }

  if (newEmail) {
    const email = await userModel.findOne({ email: newEmail }).exec();
    if (email) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    Object.assign(dataView, { new_email: newEmail });

    await userModel.findByIdAndUpdate(user_id, { email: newEmail }).exec();
  }
  if (newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, 10);

    Object.assign(dataView, { new_password: passwordHash });

    await userModel
      .findByIdAndUpdate(user_id, { password: passwordHash })
      .exec();
  }
  if (newName) {
    Object.assign(dataView, { new_name: newName });

    await userModel.findByIdAndUpdate(user_id, { name: newName }).exec();
  }
  if (newBirthDate) {
    Object.assign(dataView, { new_birth_date: newBirthDate });

    await userModel
      .findByIdAndUpdate(user_id, { birthDate: newBirthDate })
      .exec();
  }

  return res.status(201).json({ updates: dataView });
};
