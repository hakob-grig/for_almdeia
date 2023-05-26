import {
    IsBoolean,
    IsNumber,
    IsString,
    IsUrl,
    ValidateNested
} from "class-validator";
import { Type } from "class-transformer";

import { Response } from "../utils/response";

class Offer {
    @IsNumber()
    campaign_id: number;

    @IsUrl()
    icon: string;

    @IsString()
    name: string;

    @IsString()
    tracking_url: string;

    @IsString()
    instructions: string;

    @IsString()
    description: string;

    // FIXME: the rest of the object here
}

class Country {
    // FIXME: the rest of the object here
}

class State {
    // FIXME: the rest of the object here
}

class City {
    // FIXME: the rest of the object here
}

class Connection_Type {
    // FIXME: the rest of the object here
}

class Device {
    // FIXME: the rest of the object here
}

class OS {
    // this should be mapped to `isAndroid`
    @IsBoolean()
    android: boolean;

    @IsBoolean()
    // this should be mapped to `isIos`
    ios: boolean;

    @IsBoolean()
    // this should be mapped to `isDesktop`
    web: boolean;

    // FIXME: the rest of the object here
}


export class OfferWrapper {
    @Type(() => Offer)
    @ValidateNested()
    Offer: Offer;

    @Type(() => Country)
    @ValidateNested()
    Country: Country;

    @Type(() => State)
    @ValidateNested()
    State: State;

    @Type(() => City)
    @ValidateNested()
    City: City;

    @Type(() => Connection_Type)
    @ValidateNested()
    Connection_Type: Connection_Type;

    @Type(() => Device)
    @ValidateNested()
    Device: Device;

    @Type(() => OS)
    @ValidateNested()
    OS: OS;
}

export class GetOfferResponseDto extends  Response {
    @Type(() => OfferWrapper)
    // @ValidateNested()
    data: Map<string, OfferWrapper>
};
