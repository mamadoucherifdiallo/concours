import {
  ValidationArguments,
  ValidatorConstraintInterface,
} from "class-validator";
import { SchoolYear } from "src/school-year/entities/school-year.entity";

export const isValidSchoolYearCode = (code: string) =>
  code && code.includes("SCY") && code.length === 23;
export class SchoolYearCodeValidator implements ValidatorConstraintInterface {
  validate(
    code: string,
    validationArguments?: ValidationArguments
  ): boolean | Promise<boolean> {
    return isValidSchoolYearCode(code);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "Invalid School year code";
  }
}

export const getDefaultSchoolYearInfos = (schoolYear: SchoolYear) => ({
  code: schoolYear.code,
  label: schoolYear.label,
  start: schoolYear.start,
  end: schoolYear.end,
  createdAt: schoolYear.createdAt,
  lastUpdatedAt: schoolYear.lastUpdatedAt,
  order: schoolYear.order,
  competition: schoolYear.competitions,
  isDeleted: schoolYear.isDeleted,
});
