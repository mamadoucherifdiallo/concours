import { Module } from "@nestjs/common";
import { CompetitionsService } from "./competitions.service";
import { CompetitionsController } from "./competitions.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Competition, CompetitionSchema } from "./entities/competition.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Competition.name, schema: CompetitionSchema },
    ]),
  ],
  controllers: [CompetitionsController],
  providers: [CompetitionsService],
})
export class CompetitionsModule {}
