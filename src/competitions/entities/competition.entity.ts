import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, Types } from "mongoose";
import { Center } from "src/centers/entities/center.entity";
import { generateCode } from "src/herpers/main.helper";
import { Institution } from "src/institution/entities/institution.entity";
import { Option } from "src/options/entities/option.entity";
import { DefaultAttribute } from "src/shared/entities/default-attributes.entity";
import { User } from "src/users/entities/user.entity";
import {
  CandidateIdentity,
  CandidateIdentitySchema,
} from "./candidate-identity.entity";

export type CompetitionDocument = Competition & Document;

@Schema()
export class Competition extends DefaultAttribute {
  @Prop({
    type: String,
    required: true,
    unique: true,
    default: () => generateCode("CMP"),
  })
  code: string;

  @Prop({ type: String, required: true })
  label: string;

  @Prop({ type: Types.ObjectId, required: true, default: null })
  schoolYear: ObjectId;

  @Prop({ type: [CandidateIdentitySchema], required: true })
  candidatesIdentityFields: CandidateIdentity[]; // Les champs de l'identité des candidats

  @Prop({ type: [Types.ObjectId], default: [] })
  requiredDocumentsType: ObjectId[];
  
  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: [Types.ObjectId], required: true, default: [], ref: "Center" })
  centers: ObjectId[] | Center[];

  @Prop({ type: [Types.ObjectId], required: true, default: [], ref: "Option" })
  options: ObjectId[] | Option[];

  @Prop({ type: Types.ObjectId, required: true, ref: "Institution" })
  institution: ObjectId | Institution;

  @Prop({ type: [Types.ObjectId], default: [], ref: "User" })
  pendingApplicatons: ObjectId[] | User[];

  @Prop({ type: [Types.ObjectId], default: [], ref: "User" })
  acceptedApplications: ObjectId[] | User[];

  @Prop({ type: [Types.ObjectId], default: [], ref: "User" })
  rejectedApplications: ObjectId[] | User[];

  @Prop({ type: [Types.ObjectId], default: [], ref: "User" })
  cancelledApplications: ObjectId[] | User[];

  @Prop({ type: [Types.ObjectId], default: [], ref: "User" })
  admittedCandidates: ObjectId[] | User[];
}

export const CompetitionSchema = SchemaFactory.createForClass(Competition);
