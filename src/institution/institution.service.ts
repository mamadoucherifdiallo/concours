import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DuplicatedResourceException } from "src/exceptions/duplicated-resource.exception";
import { NotFoundException } from "src/exceptions/not-found.exception";
import { Result, succeed } from "src/herpers/http-response.helper";
import { getDefaultInstitutionInfos } from "src/herpers/institution.helper";
import { ErrorMessages } from "src/herpers/main.helper";
import { CreateInstitutionDto } from "./dto/create-institution.dto";
import { UpdateInstitutionDto } from "./dto/update-institution.dto";
import {
  Institution,
  InstitutionDocument,
} from "./entities/institution.entity";

const populateOptions = [
  { path: "workers", select: "-_id code firstName lastName email" },
  // { path: "centers", select: "-_id code label" },
  // { path: "options", select: "-_id code label" },
  // { path: "competitions", select: "-_id code label" },
];

@Injectable()
export class InstitutionService {
  constructor(
    @InjectModel(Institution.name)
    private readonly institutionModel: Model<InstitutionDocument>
  ) {}

  async create(createInstitutionDto: CreateInstitutionDto): Promise<Result> {
    try {
      const operationDate = new Date();
      const newInstitution = {
        ...createInstitutionDto,
        createdAt: operationDate,
        lastUpdatedAt: operationDate,
      };
      const createdInstitution = await this.institutionModel.create(
        newInstitution
      );
      return succeed({
        data: getDefaultInstitutionInfos(createdInstitution),
        message: "Institution created successfully",
      });
    } catch (error) {
      if (error.code === 11000)
        throw new DuplicatedResourceException(
          `Institution with this same name "${createInstitutionDto.name}" already exist`
        );
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  findAll() {
    return `This action returns all institution`;
  }

  async findOne(code: string): Promise<Result> {
    try {
      const institution = await this.institutionModel
        .findOne({ code })
        .populate(populateOptions);
      if (!institution) throw new NotFoundException(`Institution not found`);
      return succeed({
        data: getDefaultInstitutionInfos(institution),
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
    updateInstitutionDto: UpdateInstitutionDto
  ): Promise<Result> {
    try {
      const institution = await this.institutionModel.findOne({ code });
      if (!institution) throw new NotFoundException("Institution not found");
      institution.name = updateInstitutionDto.name || institution.name;
      institution.acronym = updateInstitutionDto.acronym || institution.acronym;
      institution.address = updateInstitutionDto.address || institution.address;
      institution.oldName = updateInstitutionDto.oldName || institution.oldName;
      institution.emails = updateInstitutionDto.emails || institution.emails;
      institution.phoneNumbers =
        updateInstitutionDto.phoneNumbers || institution.phoneNumbers;
      institution.websites =
        updateInstitutionDto.websites || institution.websites;
      institution.lastUpdatedAt = new Date();

      await institution.save();
      return succeed({
        data: getDefaultInstitutionInfos(institution),
        message: `Institution updated successfully`,
      });
    } catch (error) {
      if (error.code === 11000)
        throw new DuplicatedResourceException(
          `Institution with this same name "${updateInstitutionDto.name}" ${
            updateInstitutionDto.acronym
              ? "or acronym " + updateInstitutionDto.acronym
              : ""
          } already exist`
        );
      if (error.status === 404) throw new NotFoundException(error.message);
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} institution`;
  }
}
