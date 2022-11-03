import { Global, Module } from "@nestjs/common";
import { InstitutionService } from "./institution.service";
import { InstitutionController } from "./institution.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Institution, InstitutionSchema } from "./entities/institution.entity";
import { InstitutionHelperService } from "./institution.helper.service";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Institution.name, schema: InstitutionSchema },
    ]),
  ],
  controllers: [InstitutionController],
  providers: [InstitutionService, InstitutionHelperService],
  exports: [InstitutionHelperService],
})
export class InstitutionModule {}
