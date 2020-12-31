import { Request, Response } from 'express';
import * as yup from 'yup';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { UserModel } from '../models/UserModel';
import { authToken } from '../utils/authToken';

class SessionController {
  async store(req: Request, res: Response) {
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

    const session = {
      email: email,
      password: password_hash,
      name: name,
      birthDate: birthDate,
      registered: formatDate(),
    };

    const user = new UserModel();
    const userFind = await UserModel.findOne({ email }).exec();
    if (userFind) {
      return res.status(400).json({ error: 'User already exists' });
    }
    Object.assign(user, session);
    const data = await UserModel.create(user);
    await data.save();

    return res.json(data);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

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

    const user = await UserModel.findOne({ email }).exec();
    if (!user) {
      return res.status(400).json({ error: 'User not exists' });
    }

    if (!(await user.check(password))) {
      return res.status(400).json({ error: 'Password invalid' });
    }

    return res.status(201).json({
      user: {
        email: user.email,
        name: user.name,
      },
      token: jwt.sign({ email: user.email }, authToken.secret, {
        expiresIn: authToken.expiresIn,
      }),
    });
  }

  async update(req: Request, res: Response) {
    const {
      email,
      password,
      newEmail,
      newPassword,
      confirmPassword,
      newName,
      newBirthDate,
    } = req.body;

    const schema = yup.object().shape({
      email: yup.string().email('Email is not valid').required(),
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

    const user = await UserModel.findOne({ email }).exec();
    const user_id = user?._id;

    if (!user) {
      return res.status(400).json({ error: 'User not exists' });
    }
    if (!(await user.check(password))) {
      return res.status(400).json({ error: 'Password invalid' });
    }

    if (newEmail) {
      Object.assign(dataView, { new_email: newEmail });

      await UserModel.findByIdAndUpdate({ _id: user_id }, { email: newEmail });
      console.log('email : [UPDATE]');
    }
    if (newPassword) {
      const passwordHash = await bcrypt.hash(newPassword, 10);

      Object.assign(dataView, { new_password: passwordHash });

      await UserModel.findByIdAndUpdate(
        { _id: user_id },
        { password: passwordHash },
      );

      console.log('password : [UPDATE]');
    }
    if (newName) {
      Object.assign(dataView, { new_name: newName });

      await UserModel.findByIdAndUpdate({ _id: user_id }, { name: newName });
      console.log('name : [UPDATE]');
    }
    if (newBirthDate) {
      Object.assign(dataView, { new_birth_date: newBirthDate });

      await UserModel.findByIdAndUpdate(
        { _id: user_id },
        { birthDate: newBirthDate },
      );

      console.log('birthdate : [UPDATE]');
    }

    return res.status(201).json({ updates: dataView });
  }
}

export default new SessionController();
