import { IsArray, IsNotEmpty, IsOptional, Validate } from "class-validator";
import { InstitutionCodeValidator } from "src/herpers/institution.helper";

export class CreateCenterDto {
  @IsNotEmpty({ message: "Center's names is require" })
  @IsArray({message: "Center's names must be array of center name"})
  names: string[];

  @IsNotEmpty({ message: "Institution is require" })
  @Validate(InstitutionCodeValidator)
  institution: string;

  @IsOptional()
  requiredDocumentsType: string[];  // rajouter le validateur pour le type de document
}
