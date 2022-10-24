import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { generateCode } from "src/herpers/main.helper";
import { DefaultAttribute } from "src/shared/entities/default-attributes.entity";

export type UserDocument = User & Document;

export enum EAccountType {
  STUDENT = "Student",
  WORKER = "Worker",
  ADMIN = "Admin",
}
@Schema({ discriminatorKey: "accountType" })
export class User extends DefaultAttribute {
  @Prop({
    type: String,
    required: true,
    unique: true,
    default: () => generateCode("USR"),
  })
  code: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({ type: String, default: '' })
  phoneNumber: string;

  @Prop({ type: Date, default: null })
  birthDay: Date;

  @Prop({ type: String, required: true, enum: EAccountType })
  accountType: string;

  @Prop({ type: Types.ObjectId, default: null })
  role: string;

  @Prop({ type: String, default: null })
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
