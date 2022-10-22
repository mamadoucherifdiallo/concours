import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { generateDefaultPassword } from "src/herpers/main.helper";
import { CreateStudentDto, CreateWorkerDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<any>) {}
  async createStudent(createStudentDto: CreateStudentDto) {
    try {
      const operationDate = new Date();
      const newUser = {
        ...createStudentDto,
        accountType: "Student",
        createdAt: operationDate,
        lastUpdatedAt: operationDate,
      };
      const createdUser = await this.userModel.create(newUser);
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
      const password = generateDefaultPassword;
      const newUser = {
        ...createWorkerDto,
        accountType: "Worker",
        password,
        createdAt: operationDate,
        lastUpdatedAt: operationDate,
      };
      const createdUser = await this.userModel.create(newUser);
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
