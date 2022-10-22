import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { DefaultAttribute } from "src/shared/entities/default-attributes.entity";

@Schema()
export class Admin extends DefaultAttribute {
  code: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isActive: boolean;
  role: string;
  token: string;
  accountType: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
