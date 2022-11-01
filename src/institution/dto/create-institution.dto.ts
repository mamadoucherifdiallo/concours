import { IsNotEmpty, IsOptional, Validate } from "class-validator";
import { EmailsValidator, PhoneNumbersValidator } from "src/herpers/institution.helper";

export class CreateInstitutionDto {
  @IsNotEmpty({ message: "Institution name is require" })
  name: string;

  @IsNotEmpty({ message: "Institution address is require" })
  address: string;

  @IsNotEmpty({ message: "Institution must have at least one email address" }) // Rajouter un custom validateur pour les emails
  @Validate(EmailsValidator)
  emails: string[];

  @IsNotEmpty({ message: "Institution must have at least one phone number" }) // Rajouter un custom validateur pour les numéro de téléphone
  @Validate(PhoneNumbersValidator)
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
