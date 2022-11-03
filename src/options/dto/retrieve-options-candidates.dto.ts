import { IsNotEmpty, Validate } from "class-validator";
import { EDataToRetrive } from "src/herpers/main.helper";
import { OptionCodeValidator } from "src/herpers/option.helper";

export class RetrieveOptionsCandidatesDto {
    @IsNotEmpty({message: "Yu must privide at least one center"})
    @Validate(OptionCodeValidator)
    center: string;

    @IsNotEmpty({message: "Page is require"})
    page: number;

    @IsNotEmpty({message: "Limit is require"})
    limit: number;

    @IsNotEmpty({message: "Data to retrieve is require"})
    dataToRetrieve: EDataToRetrive;
}