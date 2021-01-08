import {
  prop,
  getModelForClass,
  modelOptions,
  plugin,
} from '@typegoose/typegoose';
import { AutoIncrementID } from '@typegoose/auto-increment';

import { db } from '../utils/db';

@modelOptions({ schemaOptions: { collection: 'media' } })
@plugin(AutoIncrementID, { startAt: 1, incrementBy: 1, field: 'id' })
export class Media {
  @prop({ type: Number })
  public id: number;

  @prop({ type: String, required: true })
  title: string;

  @prop({ type: String, required: true })
  urlS3: string;

  @prop({ type: Number, required: true })
  duration: number;

  @prop({ type: Number, required: true })
  price: number;

  @prop({ type: Boolean, required: true, default: true })
  disponible: boolean;
}

export const mediaModel = getModelForClass(Media);

mediaModel.db = db;
