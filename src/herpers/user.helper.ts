import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

export const isValidUserCode = (code) =>
  code && code.includes("USR") && code.length === 23;

@ValidatorConstraint({ name: "UserCodeValidator" })
export class UserCodeValidator implements ValidatorConstraintInterface {
  validate(
    code: string,
    validationArguments?: ValidationArguments
  ): boolean | Promise<boolean> {
    return isValidUserCode(code);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "Invalid user code";
  }
}
