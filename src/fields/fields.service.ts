import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { DuplicatedResourceException } from "src/exceptions/duplicated-resource.exception";
import { NotFoundException } from "src/exceptions/not-found.exception";
import { Result, succeed } from "src/herpers/http-response.helper";
import { ErrorMessages } from "src/herpers/main.helper";
import { PaginationDto } from "src/shared/dto/pagination.dto";
import { CreateFieldsDto } from "./dto/create-field.dto";
import { UpdateFieldDto } from "./dto/update-field.dto";
import { Field, FieldDocument } from "./entities/field.entity";

@Injectable()
export class FieldsService {
  constructor(
    @InjectModel(Field.name) private readonly fieldModel: Model<FieldDocument>
  ) {}

  async create(createFieldsDto: CreateFieldsDto): Promise<Result> {
    try {
      const fieldsNames = createFieldsDto.fields.flatMap((field) => field.name);
      const existedFields = await this.fieldModel.find({ name: fieldsNames });
      if (existedFields.length) {
        throw new DuplicatedResourceException(
          `At least one field you want create already exist`
        );
      }
      const operationDate = new Date();
      const newFields = createFieldsDto.fields.flatMap((field) => ({
        ...field,
        createdAt: operationDate,
        lastUpdatedAt: operationDate,
      }));
      const createdFields = await this.fieldModel.create(newFields);
      return succeed({
        data: createdFields,
      });
    } catch (error) {
      if (error.status === 409)
        throw new DuplicatedResourceException(error.message);
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Result> {
    try {
      const skip = (paginationDto.page - 1) * paginationDto.limit;
      const fields = await this.fieldModel.find({}, "-_id -__v", {
        skip: skip,
        limit: paginationDto.limit,
      });

      return succeed({
        data: fields,
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
      const field = await this.fieldModel.findOne({ code }, "-_id -__v");
      if (!field) throw new NotFoundException("Field not found");
      return succeed({
        data: field,
      });
    } catch (error) {
      if (error.status === 404) throw new NotFoundException(error.message);
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(code: string, updateFieldDto: UpdateFieldDto): Promise<Result> {
    try {
      const field = await this.fieldModel.findOne({ code });
      if (!field) throw new NotFoundException("Field not found");
      field.name = updateFieldDto.name || field.name;
      field.label = updateFieldDto.label || field.label;
      field.lastUpdatedAt = new Date();
      await field.save();
      return succeed({
        data: field,
      });
    } catch (error) {
      if (error.code === 11000)
        throw new DuplicatedResourceException(
          `Field with this same name: "${updateFieldDto.name}" already exist`
        );
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} field`;
  }
}
