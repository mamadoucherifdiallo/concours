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
import { RoleService } from "./role.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { JwtAuthGuard } from "src/authentification/jwt-auth.guard";
import { ERole, isValidRoleCode } from "src/herpers/role.helper";
import { InvalidCodeException } from "src/exceptions/invalid-code.exception";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/custom-decorators/roles.decorator";

@Controller("roles")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Roles(ERole.STUDENT,ERole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(":code")
  findOne(@Param("code") code: string) {
    if (!isValidRoleCode(code))
      throw new InvalidCodeException("Invalid role code");
    return this.roleService.findOne(code);
  }

  @Patch(":code")
  update(@Param("code") code: string, @Body() updateRoleDto: UpdateRoleDto) {
    if (!isValidRoleCode(code))
      throw new InvalidCodeException("Invalid role code");
    return this.roleService.update(code, updateRoleDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.roleService.remove(+id);
  }
}
