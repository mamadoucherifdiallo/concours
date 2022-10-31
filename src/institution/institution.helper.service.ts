import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Institution,
  InstitutionDocument,
} from "./entities/institution.entity";

@Injectable()
export class InstitutionHelperService {
  constructor(
    @InjectModel(Institution.name)
    private readonly institutionModel: Model<InstitutionDocument>
  ) {}

  async __addWorkersToInstition(institutionId: any, workerIds: any[]) {
    return await this.institutionModel.findOneAndUpdate(
      { _id: institutionId },
      {
        $addToSet: {
          workers: { $each: workerIds },
        },
      }
    );
  }

  async removeWorkersFromInstitution(institutionId: any, workerIds: any[]) {
    return await this.institutionModel.findOneAndUpdate(
      { _id: institutionId },
      {
        $pull: {
          workers: { $each: workerIds },
        },
      }
    );
  }

  async __addCompetitionsToInstition(institutionId: any, workerIds: any[]) {
    return await this.institutionModel.findOneAndUpdate(
      { _id: institutionId },
      {
        $addToSet: {
          competitions: { $each: workerIds },
        },
      }
    );
  }

  async removeCompetitionsFromInstitution(
    institutionId: any,
    workerIds: any[]
  ) {
    return await this.institutionModel.findOneAndUpdate(
      { _id: institutionId },
      {
        $pull: {
          competitions: { $each: workerIds },
        },
      }
    );
  }

  async __addCentersToInstition(institutionId: any, workerIds: any[]) {
    return await this.institutionModel.findOneAndUpdate(
      { _id: institutionId },
      {
        $addToSet: {
          centers: { $each: workerIds },
        },
      }
    );
  }

  async removeCentersFromInstitution(institutionId: any, workerIds: any[]) {
    return await this.institutionModel.findOneAndUpdate(
      { _id: institutionId },
      {
        $pull: {
          centers: { $each: workerIds },
        },
      }
    );
  }

  async __addOptionsToInstition(institutionId: any, workerIds: any[]) {
    return await this.institutionModel.findOneAndUpdate(
      { _id: institutionId },
      {
        $addToSet: {
          options: { $each: workerIds },
        },
      }
    );
  }

  async removeOptionsFromInstitution(institutionId: any, workerIds: any[]) {
    return await this.institutionModel.findOneAndUpdate(
      { _id: institutionId },
      {
        $pull: {
          options: { $each: workerIds },
        },
      }
    );
  }

  async findOneByCodeOrName(value: string) {
    return await this.institutionModel.findOne({
      $or: [{ code: value }, { name: value }],
    });
  }
}
