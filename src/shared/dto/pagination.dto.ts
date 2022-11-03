import { IsNotEmpty, IsOptional, Min, Validate } from "class-validator";
import { InstitutionCodeValidator } from "src/herpers/institution.helper";

export class PaginationDto {
  @IsNotEmpty({ message: "page is require" })
  @Min(1)
  page: number;

  @IsNotEmpty({ message: "limit is require" })
  @Min(1)
  limit: number;

  @IsOptional()
  searchTerm: string;

  @IsOptional()
  sortProp: string;

  @IsOptional()
  @Validate(InstitutionCodeValidator)
  institution: string;
}
