import { IsNotEmpty } from "class-validator";

export class UpdateOptionDto {
    @IsNotEmpty({message: "Center name is require"})
    name: string;
}
