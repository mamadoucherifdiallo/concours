import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Field, FieldSchema } from "src/fields/entities/field.entity";
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
  @Prop({ type: [FieldSchema], default: [] })
  field: Field[];

  @Prop({ type: Boolean, required: true, default: false })
  isRequired: boolean;

  @Prop({ type: [FieldValidatorsSchema], default: [] })
  validators: FieldValidators[];
}

export const CandidateIdentitySchema =
  SchemaFactory.createForClass(CandidateIdentity);
