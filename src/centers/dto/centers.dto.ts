import { IsArray, IsNotEmpty, Validate } from "class-validator";
import { ArrayCenterCodesValidator } from "src/herpers/center.helper";

export class CentersDto {
  @IsNotEmpty({ message: "You must provide at least one center to delete" })
  @IsArray({ message: "You must provide array of center's code" })
  @Validate(ArrayCenterCodesValidator)
  centers: string[];
}
