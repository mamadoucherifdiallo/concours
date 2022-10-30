import { Module } from "@nestjs/common";
import { SchoolYearService } from "./school-year.service";
import { SchoolYearController } from "./school-year.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { SchoolYear, SchoolYearSchema } from "./entities/school-year.entity";
import { SchoolYearHelperService } from "./school-year.helper.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SchoolYear.name, schema: SchoolYearSchema },
    ]),
  ],
  controllers: [SchoolYearController],
  providers: [SchoolYearService, SchoolYearHelperService],
  exports: [SchoolYearHelperService],
})
export class SchoolYearModule {}
