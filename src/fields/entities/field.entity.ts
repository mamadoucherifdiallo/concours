import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { generateCode } from "src/herpers/main.helper";
import { DefaultAttribute } from "src/shared/entities/default-attributes.entity";
import {
  FieldOption,
  FieldOptionSchema,
} from "src/shared/entities/field-option.entity";

export type FieldDocument = Field & Document;

@Schema()
export class Field extends DefaultAttribute {
  @Prop({
    type: String,
    required: true,
    unique: true,
    default: () => generateCode("FLD"),
  })
  code: string;

  @Prop({ type: String, required: true, unique: true })
  name: string; // field name pour l'accés côté frontend(c'est un enum que j'ai mis en place en adéquation avec les propriété de l'entité user)

  @Prop({ type: String, required: true, unique: true })
  label: string; // Nom qui sera affiché pour ce champ

  @Prop({ type: String, required: true })
  fieldType: string; // type de champ (text, comment, number, select, radio, checkbox)

  @Prop({ type: [FieldOptionSchema], default: [] })
  fieldOptions: FieldOption[]; // s'il s'agit d'un (select, radio ou checkbox donner les options possible)
}

export const FieldSchema = SchemaFactory.createForClass(Field);
