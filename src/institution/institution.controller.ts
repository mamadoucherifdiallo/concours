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
import { InstitutionService } from "./institution.service";
import { CreateInstitutionDto } from "./dto/create-institution.dto";
import { UpdateInstitutionDto } from "./dto/update-institution.dto";
import { JwtAuthGuard } from "src/authentification/jwt-auth.guard";
import { isValidInstitutionCode } from "src/herpers/institution.helper";
import { InvalidCodeException } from "src/exceptions/invalid-code.exception";

@UseGuards(JwtAuthGuard)
@Controller("institution")
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Post()
  create(@Body() createInstitutionDto: CreateInstitutionDto) {
    return this.institutionService.create(createInstitutionDto);
  }

  @Get()
  findAll() {
    return this.institutionService.findAll();
  }

  @Get(":code")
  findOne(@Param("code") code: string) {
    if (!isValidInstitutionCode(code))
      throw new InvalidCodeException("Invalid institution code");
    return this.institutionService.findOne(code);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateInstitutionDto: UpdateInstitutionDto
  ) {
    return this.institutionService.update(+id, updateInstitutionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.institutionService.remove(+id);
  }
}
