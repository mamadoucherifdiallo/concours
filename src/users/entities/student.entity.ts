import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DefaultAttribute } from "src/shared/entities/default-attributes.entity";

@Schema()
export class Student extends DefaultAttribute {
  code: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isActive: boolean;
  role: string;
  accountType: string;
  token: string;
  @Prop({ default: [] })
  competitions: any[];
  @Prop({ default: [] })
  documents: any[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
