import { IsNotEmpty } from "class-validator";

export class UpdateCenterDto {
    @IsNotEmpty({message: "Center name is require"})
    name: string;
}
