import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Query } from "../models/query.dto";

export abstract class Response {
    @Type(() => Query)
    @ValidateNested()
    query: Query;

    abstract responses: any;
}
