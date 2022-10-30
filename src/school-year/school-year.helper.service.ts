import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SchoolYear, SchoolYearDocument } from "./entities/school-year.entity";

@Injectable()
export class SchoolYearHelperService {
  constructor(
    @InjectModel(SchoolYear.name)
    private readonly schoolYearModel: Model<SchoolYearDocument>
  ) {}

  async __findSchoolYearByLabelOrCode(value: string) {
    return await this.schoolYearModel.findOne({
      $or: [{ code: value }, { label: value }],
    });
  }

  async __addCompetitionsToSchoolYear(schoolYearId: any, competitonIds: any[]) {
    return await this.schoolYearModel.findOneAndUpdate(
      { _id: schoolYearId },
      {
        $addToSet: {
          competitions: { $each: competitonIds },
        },
      }
    );
  }

  async __removeCompetitionFromSchoolYear(schoolYearId: any, competitonIds: any[]){
    return await this.schoolYearModel.findOneAndUpdate(
      { _id: schoolYearId },
      {
        $pull: {
          competitions: { $each: competitonIds },
        },
      }
    );
  }
}
