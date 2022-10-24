import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./entities/user.entity";

@Injectable()
export class UserHelperService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async __findOneByEmail(email: string){
    return await this.userModel.findOne({email: email})
  }
}
