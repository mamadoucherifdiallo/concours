import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { DuplicatedResourceException } from "src/exceptions/duplicated-resource.exception";
import { NotFoundException } from "src/exceptions/not-found.exception";
import { getDefaultCenterInfos } from "src/herpers/center.helper";
import { Result, succeed } from "src/herpers/http-response.helper";
import { ErrorMessages, getPropToRetrieve } from "src/herpers/main.helper";
import { InstitutionHelperService } from "src/institution/institution.helper.service";
import { PaginationDto } from "src/shared/dto/pagination.dto";
import { CreateCenterDto } from "./dto/create-center.dto";
import { CentersDto } from "./dto/centers.dto";
import { RetrieveCentersCandidatesDto } from "./dto/retrieve-centers-candidates.dto";
import { UpdateCenterDto } from "./dto/update-center.dto";
import { Center, CenterDocument } from "./entities/center.entity";

const populateOptions = [
  { path: "institution", select: "-_id code name address oldName" },
];
@Injectable()
export class CentersService {
  constructor(
    @InjectModel(Center.name)
    private readonly centerModel: Model<CenterDocument>,
    private readonly institutionHelperService: InstitutionHelperService,
    @InjectConnection() private readonly connection: mongoose.Connection
  ) {}

  async create(createCenterDto: CreateCenterDto): Promise<Result> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const operationDate = new Date();
      const institution =
        await this.institutionHelperService.__findOneByCodeOrName(
          createCenterDto.institution
        );
      if (!institution) throw new NotFoundException("Institution not found");
      const newCenters = createCenterDto.names.flatMap((name) => ({
        name,
        institution: institution._id,
        requiredDocumentsType: createCenterDto?.requiredDocumentsType?.length
          ? createCenterDto.requiredDocumentsType
          : [],
        createdAt: operationDate,
        lastUpdatedAt: operationDate,
      }));
      const createdCenters = await this.centerModel.create(newCenters, {
        session: session,
      });
      const createdCentersIds = createdCenters.flatMap((center) => center._id);
      await this.institutionHelperService.__addCentersToInstition(
        institution._id,
        createdCentersIds
      );
      await session.commitTransaction();
      return succeed({
        data: createdCenters,
        message: "Center(s) created successfully",
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
      const centers = await this.centerModel
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
      const center = await this.centerModel
        .findOne({ code })
        .populate(populateOptions);
      if (!center) {
        throw new NotFoundException("Center not found");
      }
      return succeed({
        data: getDefaultCenterInfos(center),
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
    updateCenterDto: UpdateCenterDto
  ): Promise<Result> {
    try {
      const center = await this.centerModel.findOne({ code });
      if (!center) throw new NotFoundException("Center nor found");
      center.name = updateCenterDto.name || center.name;
      return succeed({
        data: center,
      });
    } catch (error) {
      if (error.status === 404) throw new NotFoundException(error.message);
      if (error.code === 11000)
        throw new DuplicatedResourceException(
          `Center with this name: "${updateCenterDto.name}" already exist`
        );
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async retrieveCenterCandidatesData(
    retrieveCentersCandidatesDto: RetrieveCentersCandidatesDto
  ): Promise<Result> {
    try {
      const arrayToReturn = getPropToRetrieve(
        retrieveCentersCandidatesDto.dataToRetrieve
      );
      const skip =
        (retrieveCentersCandidatesDto.page - 1) *
        retrieveCentersCandidatesDto.limit;
      const projection = { _id: 0, code: 1, name: 1 };
      projection[arrayToReturn] = {
        $slice: [skip, retrieveCentersCandidatesDto.limit],
      };
      const data = await this.centerModel
        .findOne(
          {
            code: retrieveCentersCandidatesDto.center,
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

  async removeCenters(removeCenterDto: CentersDto): Promise<Result> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const updatedCenters = await this.centerModel.updateMany(
        { code: { $in: removeCenterDto.centers } },
        { isDeleted: true },
        { session: session }
      );
      if (!updatedCenters) throw new NotFoundException("Center not found");
      const getAllUpdatedCenters = await this.centerModel.find({
        code: { $in: removeCenterDto.centers },
      });
      const updatedCentersIds = getAllUpdatedCenters.flatMap(
        (center) => center._id
      );
      const institution = getAllUpdatedCenters[0].institution;
      await this.institutionHelperService.__removeCentersFromInstitution(
        institution,
        updatedCentersIds
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

  async addCentersToInstitution(addCenterDto: CentersDto): Promise<Result> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const centers = await this.centerModel.find({
        code: { $in: addCenterDto.centers },
      });
      if (centers.length !== addCenterDto.centers.length) {
        throw new NotFoundException(
          "At least one center code you provided in not exist"
        );
      }
      const updatedCenters = await this.centerModel.updateMany(
        { code: addCenterDto.centers },
        { isDeleted: false },
        { session: session }
      );
      if (!updatedCenters)
        throw new NotFoundException(
          "At least one center code you provided in not exist"
        );
      const centersIds = centers.flatMap((center) => center._id);
      await this.institutionHelperService.__addCentersToInstition(
        centers[0].institution,
        centersIds
      );
      await session.commitTransaction();
      return succeed({
        data: null,
        message: "Center(s) added successfully",
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
