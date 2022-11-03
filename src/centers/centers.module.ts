import { Module } from "@nestjs/common";
import { CentersService } from "./centers.service";
import { CentersController } from "./centers.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Center, CenterSchema } from "./entities/center.entity";
import { CenterHelperService } from "./center.helper.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Center.name, schema: CenterSchema }]),
  ],
  controllers: [CentersController],
  providers: [CentersService, CenterHelperService],
  exports: [CenterHelperService],
})
export class CentersModule {}
