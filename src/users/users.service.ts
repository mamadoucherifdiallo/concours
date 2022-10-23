import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  generateDefaultPassword,
  generateToken,
} from "src/herpers/main.helper";
import { MailService } from "src/mail/mail.service";
import { CreateStudentDto, CreateWorkerDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { EAccountType, User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<any>,
    private readonly mailService: MailService
  ) {}

  async createStudent(createStudentDto: CreateStudentDto) {
    try {
      const operationDate = new Date();
      const salt = await bcrypt.genSalt();
      const newUser = {
        ...createStudentDto,
        password: await bcrypt.hash(createStudentDto.password, salt),
        token: await bcrypt.hash(generateToken(), salt),
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
      return {
        data: createdUser,
        code: HttpStatus.CREATED,
        error: null,
        message: "Student account created successfully",
        success: true,
      };
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

  async createWorker(createWorkerDto: CreateWorkerDto) {
    try {
      const operationDate = new Date();
      const salt = await bcrypt.genSalt();
      const password = generateDefaultPassword;
      console.log(password);

      const newUser = {
        ...createWorkerDto,
        accountType: "Worker",
        password: await bcrypt.hash(password, salt),
        token: await bcrypt.hash(generateToken(), salt),
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
      return {
        data: createdUser,
        code: HttpStatus.CREATED,
        error: null,
        message: "Worker account created successfully",
        success: true,
      };
    } catch (error) {
      console.log(error);

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
}
