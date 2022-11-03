import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from "class-validator";
import { Option } from "src/options/entities/option.entity";
  
  export const isValidOptionCode = (code: string) =>
    code && code.includes("OPT") && code.length === 23;

  @ValidatorConstraint({ name: "OptionCodeValidator" })
  export class OptionCodeValidator implements ValidatorConstraintInterface {
    validate(
      code: string,
      validationArguments?: ValidationArguments
    ): boolean | Promise<boolean> {
      return isValidOptionCode(code);
    }
  
    defaultMessage(validationArguments?: ValidationArguments): string {
      return "Invalid option code";
    }
  }
  
  @ValidatorConstraint({ name: "ArrayOptionCodesValidator" })
  export class ArrayOptionCodesValidator implements ValidatorConstraintInterface {
    validate(
        optionCodes: string[],
      validationArguments?: ValidationArguments
    ): boolean | Promise<boolean> {
      let isValidArrayOptionCodes = true;
      for (const optionCode of optionCodes) {
        if (!isValidOptionCode(optionCode)) isValidArrayOptionCodes = false;
      }
      return isValidArrayOptionCodes;
    }
  
    defaultMessage(validationArguments?: ValidationArguments): string {
      return "At least one option code you provided in is invalid";
    }
  }
  
  export const getDefaultOptionsInfos = (option: Option) => ({
    code: option.code,
    name: option.name,
    institution: option.institution,
    isDeleted: option.isDeleted,
    createdAt: option.createdAt,
    lastUpdatedAt: option.lastUpdatedAt,
  });
  