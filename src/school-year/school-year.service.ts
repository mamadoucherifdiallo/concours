import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DuplicatedResourceException } from "src/exceptions/duplicated-resource.exception";
import { NotFoundException } from "src/exceptions/not-found.exception";
import { Result, succeed } from "src/herpers/http-response.helper";
import { ErrorMessages } from "src/herpers/main.helper";
import { getDefaultSchoolYearInfos } from "src/herpers/school-year.helper";
import { CreateSchoolYearDto } from "./dto/create-school-year.dto";
import { UpdateSchoolYearDto } from "./dto/update-school-year.dto";
import { SchoolYear, SchoolYearDocument } from "./entities/school-year.entity";

@Injectable()
export class SchoolYearService {
  constructor(
    @InjectModel(SchoolYear.name)
    private readonly schoolYearModel: Model<SchoolYearDocument>
  ) {}
  async create(createSchoolYearDto: CreateSchoolYearDto): Promise<Result> {
    try {
      const order = (await this.schoolYearModel.find({}).count()) + 1;
      const operationDate = new Date();
      const newSchoolYear = {
        ...createSchoolYearDto,
        createdAt: operationDate,
        lastUpdatedAt: operationDate,
        order,
      };
      const createdSchoolYear = await this.schoolYearModel.create(
        newSchoolYear
      );
      return succeed({
        data: getDefaultSchoolYearInfos(createdSchoolYear),
        message: "School year created successfully",
      });
    } catch (error) {
      if (error.code === 11000)
        throw new DuplicatedResourceException(
          `School year with same label "${createSchoolYearDto.label}" or start year "${createSchoolYearDto.start}" or end year "${createSchoolYearDto.end}" already exist.`
        );
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll(): Promise<Result> {
    try {
      return succeed({
        data: await this.schoolYearModel.find({ isDeleted: false }),
      });
    } catch (error) {
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(code: string): Promise<Result> {
    try {
      const schoolYear = await this.schoolYearModel.findOne({ code });
      if (!schoolYear) {
        throw new NotFoundException("School year not found");
      }
      return succeed({
        data: getDefaultSchoolYearInfos(schoolYear),
      });
    } catch (error) {
      if (error.status === 404) throw new NotFoundException(error.message);
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    code: string,
    updateSchoolYearDto: UpdateSchoolYearDto
  ): Promise<Result> {
    try {
      const schoolYear = await this.schoolYearModel.findOne({ code });
      if (!schoolYear) {
        throw new NotFoundException("School year not found");
      }
      schoolYear.label = updateSchoolYearDto.label || schoolYear.label;
      await schoolYear.save();
      return succeed({
        data: getDefaultSchoolYearInfos(schoolYear),
        message: "School year updated successfully",
      });
    } catch (error) {
      if (error.status === 404) throw new NotFoundException(error.message);
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} schoolYear`;
  }
}
