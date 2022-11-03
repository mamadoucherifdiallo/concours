import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, Types } from "mongoose";
import { generateCode } from "src/herpers/main.helper";
import { Institution } from "src/institution/entities/institution.entity";
import { DefaultAttribute } from "src/shared/entities/default-attributes.entity";
import { CenterHistorySchema } from "./center-history.entity";

export type CenterDocument = Center & Document;
@Schema()
export class Center extends DefaultAttribute{
  @Prop({
    type: String,
    required: true,
    unique: true,
    default: () => generateCode("CEN"),
  })
  code: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId, required: true, ref: "Institution" })
  institution: ObjectId | Institution;

  @Prop({ type: [Types.ObjectId], default: [] })
  requiredDocumentsType: ObjectId[]; // A revoir si cette propriété est nécessaire ici sinon la déplacé sur competitions

  @Prop({ type: [Types.ObjectId], default: [], ref: "User" })
  pendingApplicatons: ObjectId[];

  @Prop({ type: [Types.ObjectId], default: [], ref: "User" })
  acceptedApplications: ObjectId[];

  @Prop({ type: [Types.ObjectId], default: [], ref: "User" })
  rejectedApplications: ObjectId[];

  @Prop({ type: [Types.ObjectId], default: [], ref: "User" })
  cancelledApplications: ObjectId[];

  @Prop({ type: [Types.ObjectId], default: [], ref: "User" })
  admittedCandidates: ObjectId[];

  @Prop({ type: [CenterHistorySchema], default: [] })
  centerHistories: any[];
}

export const CenterSchema = SchemaFactory.createForClass(Center);

CenterSchema.index({ name: 1, institution: -1 }, { unique: true });
