import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class DefaultAttribute {
  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  lastUpdatedAt: Date;
}
