import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Center, CenterDocument } from "./entities/center.entity";

interface ICenter {
    name: string;
    institution: any;
    requiredDocumentsType?: string[];
}

@Injectable()
export class CenterHelperService {
  constructor(
    @InjectModel(Center.name)
    private readonly centerModel: Model<CenterDocument>
  ) {}

}