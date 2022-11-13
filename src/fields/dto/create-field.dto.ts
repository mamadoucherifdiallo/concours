import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { EFieldType } from "src/herpers/main.helper";
import { FieldOption } from "src/shared/entities/field-option.entity";

export class CreateFieldDto {
  @IsNotEmpty({ message: "Field name is require" })
  name: string;

  @IsNotEmpty({ message: "Field label is require" })
  label: string;

  @IsNotEmpty({ message: "Field name is require" })
  @IsEnum(EFieldType, {
    message:
      "FieldType must be checkbox, textarea, email, file, number, radio, select, tel, text",
  })
  fieldType: string;

  @IsOptional()
  @IsNotEmpty({ message: "Field options must not be empty" })
  @IsArray({ message: "field options must be valid array" })
  fieldOptions: FieldOption[];
}

export class CreateFieldsDto {
  @IsNotEmpty({ message: "Fields is require" })
  @ValidateNested({ each: true })
  @Type(() => CreateFieldDto)
  fields: CreateFieldDto[];
}
