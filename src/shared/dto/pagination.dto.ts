import { IsNotEmpty, IsOptional, Min } from "class-validator";

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
}
