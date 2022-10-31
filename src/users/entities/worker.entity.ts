import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { DefaultAttribute } from "src/shared/entities/default-attributes.entity";

@Schema()
export class Worker extends DefaultAttribute {
  code: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isActive: boolean;
  role: string;
  token: string;
  accountType: string;
  @Prop({ type: Types.ObjectId, required: true, default: null }) // School est requis à rajouter plutard
  institution: any;
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);
