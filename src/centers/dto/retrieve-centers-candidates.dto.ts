import { IsNotEmpty, Validate } from "class-validator";
import { CenterCodeValidator } from "src/herpers/center.helper";
import { EDataToRetrive } from "src/herpers/main.helper";

export class RetrieveCentersCandidatesDto {
    @IsNotEmpty({message: "Yu must privide at least one center"})
    @Validate(CenterCodeValidator)
    center: string[]

    @IsNotEmpty({message: "Page is require"})
    page: number;

    @IsNotEmpty({message: "Limit is require"})
    limit: number;

    @IsNotEmpty({message: "Data to retrieve is require"})
    dataToRetrieve: EDataToRetrive;
}