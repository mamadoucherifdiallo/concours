import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "./exceptions/exception.filter";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { AuthentificationModule } from './authentification/authentification.module';
import { RoleModule } from './role/role.module';
import { SchoolYearModule } from './school-year/school-year.module';
import { InstitutionModule } from './institution/institution.module';
import { CentersModule } from './centers/centers.module';
import { OptionsModule } from './options/options.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("DB_URL"),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", `.${process.env.NODE_ENV}.env`],
    }),
    AuthentificationModule,
    RoleModule,
    SchoolYearModule,
    InstitutionModule,
    CentersModule,
    OptionsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AppService,
  ],
})
export class AppModule {}
