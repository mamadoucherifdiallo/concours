import { Body, Controller, Post } from "@nestjs/common";
import { AuthentificationService } from "./authentification.service";
import { LoginDto } from "./dto/login.dto";

@Controller('auth')
export class AuthentificationController {
  constructor(
    private readonly authentificationService: AuthentificationService
  ) {}
  @Post('login')
  login(@Body() value: LoginDto) {
    return this.authentificationService.login(value);
  }
}
