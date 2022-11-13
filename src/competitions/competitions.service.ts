import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCompetitionDto } from "./dto/create-competition.dto";
import { UpdateCompetitionDto } from "./dto/update-competition.dto";
import {
  Competition,
  CompetitionDocument,
} from "./entities/competition.entity";

@Injectable()
export class CompetitionsService {
  constructor(
    @InjectModel(Competition.name)
    private readonly competitionModel: Model<CompetitionDocument>
  ) {}
  create(createCompetitionDto: CreateCompetitionDto) {
    return "This action adds a new competition";
  }

  findAll() {
    return `This action returns all competitions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} competition`;
  }

  update(id: number, updateCompetitionDto: UpdateCompetitionDto) {
    return `This action updates a #${id} competition`;
  }

  remove(id: number) {
    return `This action removes a #${id} competition`;
  }
}
