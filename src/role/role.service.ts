import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DuplicatedResourceException } from "src/exceptions/duplicated-resource.exception";
import { Result, succeed } from "src/herpers/http-response.helper";
import { ErrorMessages } from "src/herpers/main.helper";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Role, RoleDocument } from "./entities/role.entity";

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>
  ) {}
  async create(createRoleDto: CreateRoleDto): Promise<Result> {
    try {
      const operationDate = new Date();
      const newRole = {
        ...createRoleDto,
        createdAt: operationDate,
        lastUpdatedAt: operationDate,
      };
      const createdRole = await this.roleModel.create(newRole);
      return succeed({
        data: createdRole,
        message: "New role created successfully",
      });
    } catch (error) {
      if (error.status === 401)
        throw new DuplicatedResourceException(
          `Role with same name "${createRoleDto.name}" already exist`
        );
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
