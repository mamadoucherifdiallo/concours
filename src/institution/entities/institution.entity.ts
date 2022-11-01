import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, Types } from "mongoose";
import { generateCode, SocialMedia } from "src/herpers/main.helper";
import { DefaultAttribute } from "src/shared/entities/default-attributes.entity";
import { User } from "src/users/entities/user.entity";

export type InstitutionDocument = Institution & Document;
@Schema()
export class Institution extends DefaultAttribute {
  @Prop({
    type: String,
    required: true,
    unique: true,
    default: () => generateCode("INS"),
  })
  code: string;

  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, default: "" })
  oldName: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, default: "" })
  acronym: string;

  @Prop({ type: [String], default: [] })
  websites: string[];

  @Prop({ type: [String], default: [] })
  emails: string[];

  @Prop({ type: [String], default: [] })
  phoneNumbers: string[];

  @Prop({ type: Types.Array, default: [] })
  socialMedia: SocialMedia[];

  @Prop({ type: [Types.ObjectId], required: true, default: [], ref: 'Center' })
  centers: ObjectId[];

  @Prop({ type: [Types.ObjectId], required: true, default: [], ref: 'Option' })
  options: ObjectId[];

  @Prop({ type: [Types.ObjectId], required: true, default: [], ref: User.name })
  workers: ObjectId[];

  @Prop({ type: [Types.ObjectId], required: true, default: [], ref: 'Competition' })
  competitions: any[];
}

export const InstitutionSchema = SchemaFactory.createForClass(Institution);
