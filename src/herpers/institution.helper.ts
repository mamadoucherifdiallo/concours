import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Institution } from "src/institution/entities/institution.entity";
import { emailRegex, phoneNumberRegex } from "./main.helper";

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
  centers: institution.centers
});

@ValidatorConstraint({ name: "EmailsValidator" })
export class EmailsValidator implements ValidatorConstraintInterface {
  validate(
    emails: string[],
    validationArguments?: ValidationArguments
  ): boolean | Promise<boolean> {
    let isValidArrayOfEmails = true;
    for (const email of emails) {
      if (!emailRegex.test(email)) isValidArrayOfEmails = false;
    }
    return isValidArrayOfEmails;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "At least one provided emails is invalid";
  }
}

@ValidatorConstraint({ name: "PhoneNumbersValidator" })
export class PhoneNumbersValidator implements ValidatorConstraintInterface {
  validate(
    phoneNumbers: string[],
    validationArguments?: ValidationArguments
  ): boolean | Promise<boolean> {
    let isValidArrayOfPhoneNumbers = true;
    for (const phoneNumber of phoneNumbers) {
      if (!phoneNumberRegex.test(phoneNumber))
        isValidArrayOfPhoneNumbers = false;
    }
    return isValidArrayOfPhoneNumbers;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "At least one provided phoneNumber is invalid";
  }
}
