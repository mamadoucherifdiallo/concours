import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateInstitutionDto {
  @IsNotEmpty({ message: "Institution name is require" })
  name: string;

  @IsNotEmpty({ message: "Institution address is require" })
  address: string;

  @IsNotEmpty({ message: "Institution must have at least one email address" }) // Rajouter un custom validateur pour les emails
  emails: string[];

  @IsNotEmpty({ message: "Institution must have at least one phone number" }) // Rajouter un custom validateur pour les numéro de téléphone
  phoneNumbers: string[];

  @IsOptional()
  oldName: string;

  @IsOptional()
  acronym: string;

  @IsOptional()
  websites: string[]; // Rajouter un custom validateur pour les site web

  @IsOptional()
  socialMedia: any[]; // Rajouter un custom validateur pour les réseaux sociaux
}
