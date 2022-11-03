import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, Types } from "mongoose";
import { generateCode } from "src/herpers/main.helper";
import { Institution } from "src/institution/entities/institution.entity";
import { DefaultAttribute } from "src/shared/entities/default-attributes.entity";
import { OptionHistorySchema } from "./option-history.entity";

export type OptionDocument = Option & Document;
@Schema()
export class Option extends DefaultAttribute{
  @Prop({
    type: String,
    required: true,
    unique: true,
    default: () => generateCode("OPT"),
  })
  code: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId, required: true, ref: "Institution" })
  institution: ObjectId | Institution;

  @Prop({ type: [Types.ObjectId], default: [] })
  requiredDocumentsType: ObjectId[];

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

  @Prop({ type: [OptionHistorySchema], default: [] })
  optionHistories: any[];
}

export const OptionSchema = SchemaFactory.createForClass(Option);

OptionSchema.index({ name: 1, institution: -1 }, { unique: true });