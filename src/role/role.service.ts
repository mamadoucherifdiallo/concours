import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DuplicatedResourceException } from "src/exceptions/duplicated-resource.exception";
import { NotFoundException } from "src/exceptions/not-found.exception";
import { Result, succeed } from "src/herpers/http-response.helper";
import { ErrorMessages } from "src/herpers/main.helper";
import { getDefaultRoleValues } from "src/herpers/role.helper";
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

  async findAll(): Promise<Result> {
    try {
      return succeed({
        message: "",
        data: await this.roleModel
          .find({ isDeleted: false }, "-_id -__v -users")
          .lean(),
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
      const role = await this.roleModel
        .findOne({ code }, "-_id -__v -users")
        .lean();
      if (!role) {
        throw new NotFoundException("Role not found");
      }
      return succeed({
        message: "",
        data: role,
      });
    } catch (error) {
      if (error.status === 404) throw new NotFoundException(error.message);
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(code: string, updateRoleDto: UpdateRoleDto): Promise<Result> {
    try {
      const role = await this.roleModel.findOne({ code });
      if (!role) {
        throw new NotFoundException("Role not found");
      }
      role.name = updateRoleDto.name || role.name;
      role.lastUpdatedAt = new Date();
      await role.save();
      return succeed({
        message: "Role updated successfully",
        data: getDefaultRoleValues(role),
      });
    } catch (error) {
      if (error.status === 404) throw new NotFoundException(error.message);
      throw new HttpException(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
