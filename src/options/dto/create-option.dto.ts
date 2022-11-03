import { IsArray, IsNotEmpty, IsOptional, Validate } from "class-validator";
import { InstitutionCodeValidator } from "src/herpers/institution.helper";

export class CreateOptionDto {
  @IsNotEmpty({ message: "Option's names is require" })
  @IsArray({ message: "Option's names must be array of option name" })
  names: string[];

  @IsNotEmpty({ message: "Institution is require" })
  @Validate(InstitutionCodeValidator)
  institution: string;

  @IsOptional()
  requiredDocumentsType: string[]; // rajouter le validateur pour le type de document
}
