import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ErrorMessages,
  generateDefaultPassword,
  generatePin,
  generateToken,
} from "src/herpers/main.helper";
import { MailService } from "src/mail/mail.service";
import {
  ActiveAccountDto,
  CreateStudentDto,
  CreateWorkerDto,
  ResetPasswordDto,
  ResetPasswordLinkDto,
} from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { EAccountType, User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import { Result, succeed } from "src/herpers/http-response.helper";
import { JwtService } from "@nestjs/jwt";
import { UserHelperService } from "./user.helper.service";
import { UnauthorizationException } from "src/exceptions/unauthorization.exception";
import { NotFoundException } from "src/exceptions/not-found.exception";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<any>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly userHelperService: UserHelperService
  ) {}

  async createStudent(createStudentDto: CreateStudentDto): Promise<Result> {
    try {
      const operationDate = new Date();
      const salt = await bcrypt.genSalt();
      const token = {
        email: createStudentDto.email,
        randomValue: generatePin(),
      };
      const newUser = {
        ...createStudentDto,
        password: await bcrypt.hash(createStudentDto.password, salt),
        token: this.jwtService.sign(token),
        accountType: "Student",
        createdAt: operationDate,
        lastUpdatedAt: operationDate,
      };
      const createdUser = await this.userModel.create(newUser);
      await this.mailService.sendActivationEmail(
        {
          name: `${newUser.firstName} ${newUser.lastName}`,
          email: newUser.email,
          body: "Votre compte a bien été créé",
          info: "Création de nouveau compte",
        },
        "Activation de compte",
        `http://localhost:4200/account-activation/${newUser.token}`
      );
      return succeed({
        data: createdUser,
        code: HttpStatus.CREATED,
        message: "Student account created successfully",
      });
    } catch (error) {
      console.log(error);

      if (error.code === 11000)
        throw new HttpException(
          `User with email ${createStudentDto.email} already exist`,
          HttpStatus.CONFLICT
        );
      throw new HttpException(
        "INTERNAL SERVER ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createWorker(createWorkerDto: CreateWorkerDto): Promise<Result> {
    try {
      const operationDate = new Date();
      const salt = await bcrypt.genSalt();
      const password = generateDefaultPassword;

      const newUser = {
        ...createWorkerDto,
        accountType: "Worker",
        password: await bcrypt.hash(password, salt),
        token: await bcrypt.hash(generateToken(), salt), // changer bcrypt avec jwtService
        createdAt: operationDate,
        lastUpdatedAt: operationDate,
      };
      const createdUser = await this.userModel.create(newUser);
      await this.mailService.sendInfos({
        name: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        body: "Votre compte a bien été créé",
        info: "Création de nouveau compte",
      });
      return succeed({
        data: createdUser,
        code: HttpStatus.CREATED,
        message: "Student account created successfully",
      });
    } catch (error) {
      if (error.code === 11000)
        throw new HttpException(
          `User with email ${createWorkerDto.email} already exist`,
          HttpStatus.CONFLICT
        );
      throw new HttpException(
        "INTERNAL SERVER ERROR",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  findAll() {
    return this.userModel.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async activeAccount(value: ActiveAccountDto): Promise<Result> {
    try {
      const decodedProvidedToken = this.jwtService.verify(value.token);
      const user = await this.userHelperService.__findOneByEmail(
        decodedProvidedToken.email
      );
      if (value.token !== user.token) {
        throw new UnauthorizationException("Invalid token");
      }
      user.isActive = true;
      const newToken = {
        email: user.email,
        randomValue: generatePin(),
      };
      user.token = this.jwtService.sign(newToken);
      user.lastUpdatedAt = new Date();
      await user.save();
      return succeed({
        data: null,
        message: "Account activated succesfully",
        code: HttpStatus.OK,
      });
    } catch (error) {
      if (error.status === 401)
        throw new UnauthorizationException(error.message);
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async sendResetPasswordLink(
    resetPasswordLinkDto: ResetPasswordLinkDto
  ): Promise<Result> {
    try {
      const user = await this.userHelperService.__findOneByEmail(
        resetPasswordLinkDto.email
      );
      if (!user) {
        throw new NotFoundException(
          `Account with this email address "${resetPasswordLinkDto.email}" not exist.`
        );
      }
      const token = {
        email: user.email,
        randomValue: generatePin(),
      };
      const signedToken = this.jwtService.sign(token);
      this.mailService.sendResetPasswordLink(
        {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          body: "Vous avez demandé un changement de mot de passe pour votre compte. Merci de cliquer sur le lien ci-dessous pour mettre à jour votre mot de psse.",
          info: "Mise à jour de votre mot de passe",
        },
        `http://localhost:4200/send-reset-password-link/${signedToken}`
      );
      user.token = signedToken;
      await user.save();
      return succeed({
        data: null,
        message: "An email to reset your password has been sent to you",
      });
    } catch (error) {
      if (error.status === 404) throw new NotFoundException(error.message);
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<Result> {
    try {
      const decodedProvidedToken = this.jwtService.verify(
        resetPasswordDto.token
      );
      const user = await this.userHelperService.__findOneByEmail(
        decodedProvidedToken.email
      );
      if (resetPasswordDto.token !== user.token) {
        throw new UnauthorizationException("Invalid token");
      }
      const token = {
        email: user.email,
        randomValue: generatePin(),
      };
      const salt = await bcrypt.genSalt()
      user.password = await bcrypt.hash(resetPasswordDto.password, salt);
      user.token = this.jwtService.sign(token);
      await user.save();
      return succeed({
        data: null,
        message: "Your password is updated successfully",
      });
    } catch (error) {
      if (error.status === 404) throw new NotFoundException(error.message);
      if (error.status === 401)
        throw new UnauthorizationException(error.message);
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
