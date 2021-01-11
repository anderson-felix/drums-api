import bcrypt from 'bcryptjs';
import { AutoIncrementID } from '@typegoose/auto-increment';
import {
  prop,
  modelOptions,
  getModelForClass,
  plugin,
} from '@typegoose/typegoose';

import { db } from '../utils/db';

@modelOptions({ schemaOptions: { collection: 'users' } })
@plugin(AutoIncrementID, { startAt: 1, incrementBy: 1, field: 'id' })
export class User {
  @prop({ type: Number, unique: true })
  public id: number;

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

  async check(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}

export const userModel = getModelForClass(User);

userModel.db = db;
