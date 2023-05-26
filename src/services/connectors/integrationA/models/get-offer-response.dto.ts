import {
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsNumber,
    IsObject,
    IsString,
    IsUrl,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

import { Response } from "../utils/response";

class Payload {
    @IsString()
    currency_name: string;

    @IsNumber()
    offers_count: number;

    @IsArray()
    @ArrayMinSize(1)
    // @Type(() => Offer)
    // @ValidateNested({})
    offers: Offer[];
}

export enum EPlatform {
    desktop,
    mobile,
}

export enum EDevice {
    iphone_ipad,
    rest,
}


export class Offer {
    // should be mapped to `externalOfferId`
    @IsString()
    offer_id: string;

    // should be mapped to `name`
    @IsString()
    offer_name: string;

    // should be mapped to `description`
    @IsString()
    offer_desc: string;

    // should be mapped to `requirements`
    @IsString()
    call_to_action: string;

    @IsString()
    disclaimer: string;

    // should be mapped to offerUrlTemplate
    @IsUrl()
    offer_url: string;

    @IsUrl()
    offer_url_easy: string;

    @IsNumber()
    payout: number;

    @IsString()
    payout_type: string;

    @IsNumber()
    amount: number;

    // should be mapped to `thumbnail`
    @IsUrl()
    image_url: string;

    @IsUrl()
    image_url_220x124: string;

    @IsArray()
    @IsString({ each: true })
    countries: string[];

    // combine platform and device to map to `isDesktop`, `isAndroid`, `isIos`
    @IsEnum(EPlatform)
    platform: EPlatform;

    @IsString()
    device: EDevice;

    @IsObject()
    category: object;

    @IsNumber()
    last_modified: number;

    @IsUrl()
    preview_url: string;

    @IsString()
    package_id: string;

    @IsArray()
    verticals: object[];
}

export class GetOfferResponseDto extends  Response {
    @Type((type) => Payload)
    @ValidateNested()
    responses: Payload;
};
