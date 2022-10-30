import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { SchoolYearService } from "./school-year.service";
import { CreateSchoolYearDto } from "./dto/create-school-year.dto";
import { UpdateSchoolYearDto } from "./dto/update-school-year.dto";
import { JwtAuthGuard } from "src/authentification/jwt-auth.guard";
import { isValidSchoolYearCode } from "src/herpers/school-year.helper";
import { InvalidCodeException } from "src/exceptions/invalid-code.exception";

@UseGuards(JwtAuthGuard)
@Controller("school-year")
export class SchoolYearController {
  constructor(private readonly schoolYearService: SchoolYearService) {}

  @Post()
  create(@Body() createSchoolYearDto: CreateSchoolYearDto) {
    return this.schoolYearService.create(createSchoolYearDto);
  }

  @Get()
  findAll() {
    return this.schoolYearService.findAll();
  }

  @Get(":code")
  findOne(@Param("code") code: string) {
    if (!isValidSchoolYearCode(code))
      throw new InvalidCodeException("Invalid School year code");
    return this.schoolYearService.findOne(code);
  }

  @Patch(":code")
  update(
    @Param("code") code: string,
    @Body() updateSchoolYearDto: UpdateSchoolYearDto
  ) {
    if (!isValidSchoolYearCode(code))
      throw new InvalidCodeException("Invalid School year code");
    return this.schoolYearService.update(code, updateSchoolYearDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.schoolYearService.remove(+id);
  }
}
