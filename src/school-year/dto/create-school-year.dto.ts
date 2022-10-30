import {
  Equals,
  equals,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
} from "class-validator";

export class CreateSchoolYearDto {
  @IsNotEmpty({ message: "School year label is require" })
  label: string;

  @IsNotEmpty({ message: "Start year is require" })
  @IsNumber()
  @Equals(new Date().getFullYear(), {
    message: `Start year must be equal to ${new Date().getFullYear()}`,
  })
  start: Number;

  @IsNotEmpty({ message: "End year is require" })
  @IsNumber()
  @Equals(new Date().getFullYear() + 1, {
    message: `End year must be equal to ${new Date().getFullYear() + 1}`,
  })
  end: Number;
}
