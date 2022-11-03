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

export const getDefaultStudentInfos = (user: any) => ({
  code: user.code,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  birthDay: user.birthDay,
  email: user.email,
  phoneNumber: user.phoneNumber,
  createdAt: user.createdAt,
  lastUpdatedAt: user.lastUpdatedAt,
  isDeleted: user.isDeleted,
  isActive: user.isActiveAccount,
});