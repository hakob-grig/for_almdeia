import { IsEnum } from "class-validator";

import { EStatus } from "../models/status.dto";

export abstract class Response {
    @IsEnum(EStatus)
    status: EStatus;

    abstract data: any;
}
