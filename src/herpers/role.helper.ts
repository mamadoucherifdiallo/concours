import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

export const isValidRoleCode = (code: string) =>
  code && code.includes("ROL") && code.length === 23;

@ValidatorConstraint({ name: "RoleCodeValidator" })
export class RoleCodeValidator implements ValidatorConstraintInterface {
  validate(
    code: string,
    validationArguments?: ValidationArguments
  ): boolean | Promise<boolean> {
    return isValidRoleCode(code);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "Invalid role code";
  }
}

export const getDefaultRoleValues = (role) => ({
  code: role.code,
  createdAt: role.createdAt,
  lastUpdatedAt: role.lastUpdatedAt,
  isDeleted: role.isDeleted,
});
