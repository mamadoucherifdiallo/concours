import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
class FieldOption {
  @Prop({ type: String, required: true })
  label: string;

  @Prop({ type: String, required: true })
  value: string;
}

const FieldOptionSchema = SchemaFactory.createForClass(FieldOption);

@Schema({ _id: false })
class FieldValidators {
  @Prop({ type: String, required: true })
  label: string;

  @Prop({ type: String, default: null }) // Par exemple pour email il n'y aura pas de value
  value: string;
}

const FieldValidatorsSchema = SchemaFactory.createForClass(FieldValidators);

@Schema({ _id: false })
export class CandidateIdentity {
  @Prop({ type: String, required: true, unique: true })
  name: string; // field name pour l'accés côté frontend(c'est un enum que j'ai mis en place en adéquation avec les propriété de l'entité user)

  @Prop({ type: String, required: true, unique: true })
  label: string; // Nom qui sera affiché pour ce champ

  @Prop({ type: Boolean, required: true, default: false })
  isRequired: boolean;

  @Prop({ type: [FieldValidatorsSchema], default: [] })
  validators: FieldValidators;

  @Prop({ type: String, required: true })
  fieldType: string; // type de champ (text, comment, number, select, radio, checkbox)

  @Prop({ type: [FieldOptionSchema], default: [] })
  fieldOptions: FieldOption[]; // s'il s'agit d'un (select, radio ou checkbox donner les options possible)
}

export const CandidateIdentitySchema =
  SchemaFactory.createForClass(CandidateIdentity);
