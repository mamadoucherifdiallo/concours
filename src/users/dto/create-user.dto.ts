import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "firstName is required" })
  firstName: string;

  @IsNotEmpty({ message: "lastName is required" })
  lastName: string;

  @IsNotEmpty({ message: "email is required" })
  @IsEmail({ message: "Please provide email with correct email format" })
  email: string;
}

export class CreateStudentDto extends CreateUserDto {
  @IsNotEmpty({ message: "password is required" })
  password: string;
}

export class CreateWorkerDto extends CreateUserDto {
  @IsNotEmpty({ message: "School is required" })
  school: string;
}

export class ActiveAccountDto {
  @IsNotEmpty({ message: "Token is required" })
  token: string;
}

export class ResetPasswordLinkDto {
  @IsNotEmpty({ message: "email is required" })
  @IsEmail({ message: "Please provide email with correct email format" })
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({ message: "Reset password token is required" })
  token: string;

  @IsNotEmpty({ message: "password is required" })
  password: string;
}
