import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, Types } from "mongoose";
import { generateCode } from "src/herpers/main.helper";
import { DefaultAttribute } from "src/shared/entities/default-attributes.entity";

export type SchoolYearDocument = SchoolYear & Document;

@Schema()
export class SchoolYear extends DefaultAttribute {
  @Prop({
    type: String,
    require: true,
    unique: true,
    default: () => generateCode("SCY"),
  })
  code: string;

  @Prop({ type: String, require: true, unique: true })
  label: string;

  @Prop({ type: Number, required: true, unique: true })
  start: Number;

  @Prop({ type: Number, required: true, unique: true })
  end: Number;

  @Prop({ type: [Types.ObjectId], default: [] })
  competitions: ObjectId[];

  @Prop({ type: Number, default: 1 })
  order: number;
}

export const SchoolYearSchema = SchemaFactory.createForClass(SchoolYear);
