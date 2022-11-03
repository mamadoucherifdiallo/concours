import { IsArray, IsNotEmpty, Validate } from "class-validator";
import { ArrayOptionCodesValidator } from "src/herpers/option.helper";

export class OptionsDto {
  @IsNotEmpty({ message: "You must provide at least one center to delete" })
  @IsArray({ message: "You must provide array of center's code" })
  @Validate(ArrayOptionCodesValidator)
  options: string[];
}
