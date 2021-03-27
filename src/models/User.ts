import { prop, modelOptions, getModelForClass } from '@typegoose/typegoose';

import { db } from '../utils/db';

@modelOptions({ schemaOptions: { collection: 'users' } })
class User {
  @prop({ required: true, unique: true, type: String })
  email: string;

  @prop({ required: true, type: String })
  password: string;

  @prop({ required: true, type: String })
  name: string;

  @prop({ required: true, type: String })
  birthDate: string;

  @prop({ required: true, type: String })
  registered: string;
}
export default User;
export const userModel = getModelForClass(User);

userModel.db = db;
