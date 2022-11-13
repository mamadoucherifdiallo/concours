import {
  ValidationArguments,
  ValidatorConstraintInterface,
} from "class-validator";

export const isValidFieldCode = (code: string) =>
  code && code.includes("FLD") && code.length === 23;

export class FieldCodeValidator implements ValidatorConstraintInterface {
  validate(
    code: string,
    validationArguments?: ValidationArguments
  ): boolean | Promise<boolean> {
    return isValidFieldCode(code);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "Invalid field code";
  }
}
