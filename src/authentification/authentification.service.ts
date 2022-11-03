import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserHelperService } from "src/users/user.helper.service";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";
import { UnauthorizationException } from "src/exceptions/unauthorization.exception";
import { ErrorMessages } from "src/herpers/main.helper";
import { getDefaultStudentInfos } from "src/herpers/user.helper";

@Injectable()
export class AuthentificationService {
  constructor(
    private readonly userHelperService: UserHelperService,
    private readonly jwtService: JwtService
  ) {}

  async login(value: LoginDto) {
    try {
      const user = await this.validate(value);
      return {
        user: getDefaultStudentInfos(user),
        access_token: this.jwtService.sign(getDefaultStudentInfos(user)),
      };
    } catch (error) {    
        console.log(error);
      if (error.status === 401)
        throw new UnauthorizationException(error.message);
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async validate(value: LoginDto) {
    try {
      const user = await this.userHelperService.__findOneByEmail(value.email);

      if (!user) {
        throw new UnauthorizationException(
          "Not account associated with this email"
        );
      }
      const isPasswordMatch = await bcrypt.compare(
        value.password,
        user.password
      );
      if (!isPasswordMatch) {
        throw new UnauthorizationException("Wrong password please try again");
      }
      if(!user.isActive){
        throw new UnauthorizationException("Your account is deactivated. Please contact your support.");
      }
      return user;
    } catch (error) {
      if (error.status === 401)
        throw new UnauthorizationException(error.message);
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
