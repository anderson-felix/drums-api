import bcrypt from 'bcryptjs';

import User, { userModel } from '../../models/User';

interface IRequest {
  email: string;
  password: string;
  name: string;
  birthDate: string;
}
class CreateUserService {
  public async execute({
    email,
    password,
    name,
    birthDate,
  }: IRequest): Promise<User> {
    const findUser = await userModel.findOne({ email }).exec();
    if (findUser) throw new Error('User already exists');

    const password_hash = await bcrypt.hash(password, 10);

    const formatDate = () => {
      const date = new Date();
      return date;
    };

    const user = {
      email,
      password: password_hash,
      name,
      birthDate,
      registered: formatDate().toString(),
    };

    try {
      const data = await userModel.create(user);
      await data.save();
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
export default CreateUserService;
