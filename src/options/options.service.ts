import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { DuplicatedResourceException } from "src/exceptions/duplicated-resource.exception";
import { NotFoundException } from "src/exceptions/not-found.exception";
import { Result, succeed } from "src/herpers/http-response.helper";
import { ErrorMessages, getPropToRetrieve } from "src/herpers/main.helper";
import { getDefaultOptionsInfos } from "src/herpers/option.helper";
import { InstitutionHelperService } from "src/institution/institution.helper.service";
import { PaginationDto } from "src/shared/dto/pagination.dto";
import { CreateOptionDto } from "./dto/create-option.dto";
import { OptionsDto } from "./dto/options.dto";
import { RetrieveOptionsCandidatesDto } from "./dto/retrieve-options-candidates.dto";
import { UpdateOptionDto } from "./dto/update-option.dto";
import { Option, OptionDocument } from "./entities/option.entity";

const populateOptions = [
  { path: "institution", select: "-_id code name address oldName" },
];

@Injectable()
export class OptionsService {
  constructor(
    @InjectModel(Option.name)
    private readonly optionModel: Model<OptionDocument>,
    private readonly institutionHelperService: InstitutionHelperService,
    @InjectConnection() private readonly connection: mongoose.Connection
  ) {}

  async create(createOptionDto: CreateOptionDto): Promise<Result> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const operationDate = new Date();
      const institution =
        await this.institutionHelperService.__findOneByCodeOrName(
          createOptionDto.institution
        );
      if (!institution) throw new NotFoundException("Institution not found");
      const newCenters = createOptionDto.names.flatMap((name) => ({
        name,
        institution: institution._id,
        requiredDocumentsType: createOptionDto?.requiredDocumentsType?.length
          ? createOptionDto.requiredDocumentsType
          : [],
        createdAt: operationDate,
        lastUpdatedAt: operationDate,
      }));
      const createdCenters = await this.optionModel.create(newCenters, {
        session: session,
      });
      const createdCentersIds = createdCenters.flatMap((center) => center._id);
      await this.institutionHelperService.__addOptionsToInstition(
        institution._id,
        createdCentersIds
      );
      await session.commitTransaction();
      return succeed({
        data: createdCenters,
        message: "Option(s) created successfully",
      });
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      if (error.status === 404) throw new NotFoundException(error.message);
      if (error.code === 11000) throw new DuplicatedResourceException(error);
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } finally {
      session.endSession();
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Result> {
    try {
      let institution = null;
      if (paginationDto.institution) {
        institution = await this.institutionHelperService.__findOneByCodeOrName(
          paginationDto.institution
        );
        if (!institution) throw new NotFoundException("Institution not found");
      }
      const skip = (paginationDto.page - 1) * paginationDto.limit;
      const centers = await this.optionModel
        .find(
          {
            isDeleted: false,
            ...(paginationDto.searchTerm && {
              name: { $regex: paginationDto.searchTerm, $options: "i" },
            }),
            ...(institution && {
              institution: institution._id,
            }),
          },
          { _id: 0, __v: 0 },
          {
            limit: paginationDto.limit,
            skip,
            sort: paginationDto.sortProp,
          }
        )
        .populate(populateOptions);
      return succeed({
        data: centers,
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
      const center = await this.optionModel
        .findOne({ code })
        .populate(populateOptions);
      if (!center) {
        throw new NotFoundException("Option not found");
      }
      return succeed({
        data: getDefaultOptionsInfos(center),
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
    updateOptionDto: UpdateOptionDto
  ): Promise<Result> {
    try {
      const option = await this.optionModel.findOne({ code });
      if (!option) throw new NotFoundException("Option nor found");
      option.name = updateOptionDto.name || option.name;
      return succeed({
        data: option,
      });
    } catch (error) {
      if (error.status === 404) throw new NotFoundException(error.message);
      if (error.code === 11000)
        throw new DuplicatedResourceException(
          `Option with this name: "${updateOptionDto.name}" already exist`
        );
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async retrieveOptionCandidatesData(
    retrieveOptionsCandidatesDto: RetrieveOptionsCandidatesDto
  ): Promise<Result> {
    try {
      const arrayToReturn = getPropToRetrieve(
        retrieveOptionsCandidatesDto.dataToRetrieve
      );
      const skip =
        (retrieveOptionsCandidatesDto.page - 1) *
        retrieveOptionsCandidatesDto.limit;
      const projection = { _id: 0, code: 1, name: 1 };
      projection[arrayToReturn] = {
        $slice: [skip, retrieveOptionsCandidatesDto.limit],
      };
      const data = await this.optionModel
        .findOne(
          {
            code: retrieveOptionsCandidatesDto.center,
          },
          projection
        )
        .populate({
          path: arrayToReturn,
          select: "-_id code firstName lastName phoneNumber email",
        });
      return succeed({
        data: data,
      });
    } catch (error) {
      if (error.status === 404) throw new NotFoundException(error.message);
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async removeOptions(removeOptionDto: OptionsDto): Promise<Result> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const updatedOptions = await this.optionModel.updateMany(
        { code: { $in: removeOptionDto.options } },
        { isDeleted: true },
        { session: session }
      );
      if (!updatedOptions) throw new NotFoundException("Center not found");
      const getAllUpdatedOptions = await this.optionModel.find({
        code: { $in: removeOptionDto.options },
      });
      const updatedOptionsIds = getAllUpdatedOptions.flatMap(
        (center) => center._id
      );
      const institution = getAllUpdatedOptions[0].institution;
      await this.institutionHelperService.__removeOptionsFromInstitution(
        institution,
        updatedOptionsIds
      );
      await session.commitTransaction();
      return succeed({
        data: null,
        message: "center(s) deleted successfully",
      });
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      if (error.status === 404) throw new NotFoundException(error.message);
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } finally {
      session.endSession();
    }
  }

  async addOptionsToInstitution(addOptionDto: OptionsDto): Promise<Result> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const options = await this.optionModel.find({
        code: { $in: addOptionDto.options },
      });
      if (options.length !== addOptionDto.options.length) {
        throw new NotFoundException(
          "At least one option code you provided in not exist"
        );
      }
      const updatedOptions = await this.optionModel.updateMany(
        { code: addOptionDto.options },
        { isDeleted: false },
        { session: session }
      );
      if (!updatedOptions)
        throw new NotFoundException(
          "At least one center code you provided in not exist"
        );
      const optionsIds = options.flatMap((option) => option._id);
      await this.institutionHelperService.__addOptionsToInstition(
        options[0].institution,
        optionsIds
      );
      await session.commitTransaction();
      return succeed({
        data: null,
        message: "Option(s) added successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      if (error.status === 404) throw new NotFoundException(error.message);
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } finally {
      session.endSession();
    }
  }
}
