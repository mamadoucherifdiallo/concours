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
import { OptionsService } from "./options.service";
import { CreateOptionDto } from "./dto/create-option.dto";
import { UpdateOptionDto } from "./dto/update-option.dto";
import { PaginationDto } from "src/shared/dto/pagination.dto";
import { isValidOptionCode } from "src/herpers/option.helper";
import { InvalidCodeException } from "src/exceptions/invalid-code.exception";
import { JwtAuthGuard } from "src/authentification/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("options")
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Post()
  create(@Body() createOptionDto: CreateOptionDto) {
    return this.optionsService.create(createOptionDto);
  }

  @Post("list")
  findAll(@Body() paginationDto: PaginationDto) {
    return this.optionsService.findAll(paginationDto);
  }

  @Get(":code")
  findOne(@Param("code") code: string) {
    if (!isValidOptionCode(code))
      throw new InvalidCodeException("Invalid option code");
    return this.optionsService.findOne(code);
  }

  @Patch(":code")
  update(
    @Param("code") code: string,
    @Body() updateOptionDto: UpdateOptionDto
  ) {
    if (!isValidOptionCode(code))
      throw new InvalidCodeException("Invalid option code");
    return this.optionsService.update(code, updateOptionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.optionsService.remove(+id);
  }
}
