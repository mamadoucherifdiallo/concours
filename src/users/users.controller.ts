import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import {
  ActiveAccountDto,
  CreateStudentDto,
  CreateWorkerDto,
  ResetPasswordDto,
  ResetPasswordLinkDto,
} from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "src/authentification/jwt-auth.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("new-student")
  createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.usersService.createStudent(createStudentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("new-worker")
  createWorker(@Body() createWorkerDto: CreateWorkerDto) {
    return this.usersService.createWorker(createWorkerDto);
  }

  @Post("active-account")
  activeAccount(@Body() value: ActiveAccountDto) {
    return this.usersService.activeAccount(value);
  }

  @Post("reset-password-link")
  sendResetPasswordLink(@Body() resetPasswordLinkDto: ResetPasswordLinkDto) {
    return this.usersService.sendResetPasswordLink(resetPasswordLinkDto);
  }

  @Post("reset-password")
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
