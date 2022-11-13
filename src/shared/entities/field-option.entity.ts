import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";

@Schema({ _id: false })
export class FieldOption {
  @Prop({ type: String, required: true })
  label: string;

  @Prop({ type: String, required: true })
  value: string;
}

export const FieldOptionSchema = SchemaFactory.createForClass(FieldOption);
