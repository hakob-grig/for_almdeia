import {
    IsNumber,
    IsString
} from "class-validator";

export class Query {
    @IsString()
    pubid: string;

    @IsNumber()
    appid: number;

    @IsString()
    country: string;

    @IsString()
    platform: string;
}
