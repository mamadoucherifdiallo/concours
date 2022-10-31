import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Institution } from "src/institution/entities/institution.entity";

export const isValidInstitutionCode = (code: string) =>
  code && code.includes("INS") && code.length === 23;
@ValidatorConstraint({ name: "InstitutionCodeValidator" })
export class InstitutionCodeValidator implements ValidatorConstraintInterface {
  validate(
    code: string,
    validationArguments?: ValidationArguments
  ): boolean | Promise<boolean> {
    return isValidInstitutionCode(code);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "Invalid institution code";
  }
}

export const getDefaultInstitutionInfos = (institution: Institution) => ({
  code: institution.code,
  createdAt: institution.createdAt,
  lastUpdatedAt: institution.lastUpdatedAt,
  name: institution.name,
  acronym: institution.acronym,
  address: institution.address,
  emails: institution.emails,
  phoneNumbers: institution.phoneNumbers,
  websites: institution.websites,
  socialMedia: institution.socialMedia,
  workers: institution.workers || [],
});
