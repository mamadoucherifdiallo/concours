import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Center } from "src/centers/entities/center.entity";

export const isValidCenterCode = (code: string) =>
  code && code.includes("CEN") && code.length === 23;
@ValidatorConstraint({ name: "CenterCodeValidator" })
export class CenterCodeValidator implements ValidatorConstraintInterface {
  validate(
    code: string,
    validationArguments?: ValidationArguments
  ): boolean | Promise<boolean> {
    return isValidCenterCode(code);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "Invalid center code";
  }
}

@ValidatorConstraint({ name: "ArrayCenterCodesValidator" })
export class ArrayCenterCodesValidator implements ValidatorConstraintInterface {
  validate(
    centerCodes: string[],
    validationArguments?: ValidationArguments
  ): boolean | Promise<boolean> {
    let isValidArrayCenterCodes = true;
    for (const centerCode of centerCodes) {
      if (!isValidCenterCode(centerCode)) isValidArrayCenterCodes = false;
    }
    return isValidArrayCenterCodes;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "At least one center code you provided in is invalid";
  }
}

export const getDefaultCenterInfos = (center: Center) => ({
  code: center.code,
  name: center.name,
  institution: center.institution,
  isDeleted: center.isDeleted,
  createdAt: center.createdAt,
  lastUpdatedAt: center.lastUpdatedAt,
});
