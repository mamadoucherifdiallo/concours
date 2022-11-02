import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/authentification/jwt-auth.guard";
import { InvalidCodeException } from "src/exceptions/invalid-code.exception";
import { isValidCenterCode } from "src/herpers/center.helper";
import { PaginationDto } from "src/shared/dto/pagination.dto";
import { CentersService } from "./centers.service";
import { CreateCenterDto } from "./dto/create-center.dto";
import { CentersDto } from "./dto/centers.dto";
import { RetrieveCentersCandidatesDto } from "./dto/retrieve-centers-candidates.dto";
import { UpdateCenterDto } from "./dto/update-center.dto";

@UseGuards(JwtAuthGuard)
@Controller("centers")
export class CentersController {
  constructor(private readonly centersService: CentersService) {}

  @Post("institution/add-centers")
  addCenters(@Body() centers: CentersDto) {
    return this.centersService.addCentersToInstitution(centers);
  }

  @Post("remove/centers")
  deleteCenters(@Body() centers: CentersDto) {
    return this.centersService.removeCenters(centers);
  }

  @Post()
  create(@Body() createCenterDto: CreateCenterDto) {
    return this.centersService.create(createCenterDto);
  }

  @Post("list")
  findAll(@Body() paginationDto: PaginationDto) {
    return this.centersService.findAll(paginationDto);
  }

  @Post("retrieve-centers-candidates")
  retriveCentersCandidates(@Body() data: RetrieveCentersCandidatesDto) {
    return this.centersService.retrieveCenterCandidatesData(data);
  }

  @Get(":code")
  findOne(@Param("code") code: string) {
    if (!isValidCenterCode(code))
      throw new InvalidCodeException("Invalid center code");
    return this.centersService.findOne(code);
  }

  @Patch(":code")
  update(
    @Param("code") code: string,
    @Body() updateCenterDto: UpdateCenterDto
  ) {
    if (isValidCenterCode(code))
      throw new InvalidCodeException("Invalid center code");
    return this.centersService.update(code, updateCenterDto);
  }
}
