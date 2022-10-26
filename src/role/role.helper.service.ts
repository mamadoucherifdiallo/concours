import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Role, RoleDocument } from "./entities/role.entity";

@Injectable()
export class RoleHelperService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>
  ) {}

  async __findRoleByNameOrCode(value: string) {
    return await this.roleModel
      .findOne({
        $or: [{ code: value }, { name: value }],
      })
      .lean();
  }

  async __addUsersToRole(roleId: any, usersIds: any[]) {
    return await this.roleModel.findOneAndUpdate(
      { _id: roleId },
      {
        $addToSet: {
          users: { $each: usersIds },
        },
      }
    );
  }
}
