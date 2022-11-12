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
// Pour les candidats rajouter tous les attributs possible pour leur identité en aadéquation avec ce qui sera mis en place côte compétitions
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

  @Prop({ type: String, default: "" })
  phoneNumber: string;

  @Prop({ type: String, default: "" })
  placeOfBirth: string;

  @Prop({ type: String, enum: ["MALE", "FEMALE"], default: "" })
  gender: string;

  @Prop({ type: String, enum: ["MARRIED", "SINGLE"], default: "" })
  maritalStatus: string;

  @Prop({ type: String, default: "" })
  nationalIdNumber: string;

  @Prop({ type: Date, default: null })
  birthDay: Date;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({ type: String, required: true, enum: EAccountType })
  accountType: string;

  @Prop({ type: Types.ObjectId, default: null, ref: "Role" })
  role: string;

  @Prop({ type: String, default: null })
  token: string;

  @Prop({ type: Array, required: true, default: []})
  competitions: any[]; // { entity: Competition._id, userSpecifiqueCompetitionInfos: any(un object de type any){}}
  /* 
    userSpecifiqueCompetitionInfos {
      les choix du users pour ce concours: {},
      son numero pour le concours: string, length: 8
      un autre numero aleatoire pour l'identifié: string, length: 8
      étape à laquelle il s'est arrêter dans l'inscription: string,(pending, identity, competitionSpecifiqueInfos, DOCUMENTS, PAIEMENT, ACCEPTED, REJECTED, CANCELED, ADMITTED)
    }
  */
}

export const UserSchema = SchemaFactory.createForClass(User);
