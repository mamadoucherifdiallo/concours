import { Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleController } from "./role.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Role, RoleSchema } from "./entities/role.entity";
import { RoleHelperService } from "./role.helper.service";
/* import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "src/guards/roles.guard"; */

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [RoleController],
  providers: [
    RoleService,
    RoleHelperService,
    /* {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }, */
  ],
  exports: [RoleHelperService],
})
export class RoleModule {}
