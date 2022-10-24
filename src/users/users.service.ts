import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  generateDefaultPassword,
  generatePin,
  generateToken,
} from "src/herpers/main.helper";
import { MailService } from "src/mail/mail.service";
import { CreateStudentDto, CreateWorkerDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { EAccountType, User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import { Result, succeed } from "src/herpers/http-response.helper";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<any>,
    private readonly mailService: MailService
  ) {}

  async createStudent(createStudentDto: CreateStudentDto): Promise<Result> {
    try {
      const operationDate = new Date();
      const salt = await bcrypt.genSalt();
      const token = {
        email: createStudentDto.email,
        randomValue: generatePin() 
      }
      const newUser = {
        ...createStudentDto,
        password: await bcrypt.hash(createStudentDto.password, salt),
        token: await bcrypt.hash(JSON.stringify(token), salt),
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
      })
    } catch (error) {      
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
      return succeed({
        data: createdUser,
        code: HttpStatus.CREATED,
        message: "Student account created successfully",
      })
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
