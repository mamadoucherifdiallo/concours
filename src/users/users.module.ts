import { Global, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./entities/user.entity";
import { Student, StudentSchema } from "./entities/student.entity";
import { Worker, WorkerSchema } from "./entities/worker.entity";
import { Admin, AdminSchema } from "./entities/admin.entity";
import { UserHelperService } from "./user.helper.service";
import { MailModule } from "src/mail/mail.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RoleModule } from "src/role/role.module";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        discriminators: [
          { name: Student.name, schema: StudentSchema },
          { name: Worker.name, schema: WorkerSchema },
          { name: Admin.name, schema: AdminSchema },
        ],
      },
    ]),
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
      }),
      inject: [ConfigService],
    }),
    RoleModule
  ],
  controllers: [UsersController],
  providers: [UsersService, UserHelperService],
  exports: [UserHelperService],
})
export class UsersModule {}
