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
import { FieldsService } from "./fields.service";
import { CreateFieldsDto } from "./dto/create-field.dto";
import { UpdateFieldDto } from "./dto/update-field.dto";
import { JwtAuthGuard } from "src/authentification/jwt-auth.guard";
import { PaginationDto } from "src/shared/dto/pagination.dto";
import { InvalidCodeException } from "src/exceptions/invalid-code.exception";
import { isValidFieldCode } from "src/herpers/field.helper";

@UseGuards(JwtAuthGuard)
@Controller("fields")
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  create(@Body() createFieldsDto: CreateFieldsDto) {
    return this.fieldsService.create(createFieldsDto);
  }

  @Post("list")
  findAll(@Body() paginationDto: PaginationDto) {
    return this.fieldsService.findAll(paginationDto);
  }

  @Get(":code")
  findOne(@Param("code") code: string) {
    if (!isValidFieldCode(code))
      throw new InvalidCodeException("Invalid field code");
    return this.fieldsService.findOne(code);
  }

  @Patch(":code")
  update(@Param("code") code: string, @Body() updateFieldDto: UpdateFieldDto) {
    if (!isValidFieldCode(code))
      throw new InvalidCodeException("Invalid field code");
    return this.fieldsService.update(code, updateFieldDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.fieldsService.remove(+id);
  }
}
