import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, Types } from "mongoose";
import { generateCode } from "src/herpers/main.helper";
import { DefaultAttribute } from "src/shared/entities/default-attributes.entity";
import { User } from "src/users/entities/user.entity";

export type RoleDocument = Role & Document;

@Schema()
export class Role extends DefaultAttribute {
  @Prop({
    type: String,
    required: true,
    unique: true,
    default: () => generateCode("ROL"),
  })
  code: string;

  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: Types.ObjectId, default: [] })
  users: ObjectId[] | User[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
