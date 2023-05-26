import { Injectable } from '@nestjs/common';
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { v4 as uuidv4 } from "uuid";

import { IOfferProvider } from "../interfaces/offer-provider.interface";
import { IGetName } from "../interfaces/get-name.interface";

import { Offer } from "../../../entities/offer.entity";
import {
    EDevice,
    EPlatform,
    GetOfferResponseDto,
    Offer as IntegrationAOffer
} from "./models/get-offer-response.dto";
import { getOffersResponse } from "./mockdata/get-offers-response.data"

@Injectable()
export class IntegrationAConnectorService implements IOfferProvider, IGetName {
    constructor() {
    }

    public getName() {
        return "IntegrationA";
    }

    public async getOffers() : Promise<Offer[]> {
        const response : GetOfferResponseDto = plainToInstance(GetOfferResponseDto, getOffersResponse);
        const responseValidationResults = await validate(response);
        if (responseValidationResults.length) {
            throw new Error(`Invalid response from ${this.getName()}`);
        }

        const validExternalOffers : IntegrationAOffer[] = [];
        await Promise.allSettled(
            response.responses.offers.map(async (plainOffer) => {
                const offer : IntegrationAOffer = plainToInstance(IntegrationAOffer, plainOffer);
                const offerValidationResults = await validate(offer);
                if (!offerValidationResults.length) {
                    validExternalOffers.push(offer);
                } else {
                    console.log(`Invalid order, integration: ${this.getName()}, id: ${offer.offer_id}`);
                }
            })
        );

        return validExternalOffers.map((offer) => this.transformOfferToInternalEntity(offer));
    }

    private transformOfferToInternalEntity(externalOffer: IntegrationAOffer): Offer {
        const internalOffer = new Offer();

        internalOffer.name = externalOffer.offer_name;
        internalOffer.slug = uuidv4();
        internalOffer.description = externalOffer.offer_desc;
        internalOffer.requirements = externalOffer.call_to_action;
        internalOffer.thumbnail = externalOffer.image_url;
        internalOffer.isDesktop = +(externalOffer.platform === EPlatform.desktop);
        internalOffer.isAndroid = +(externalOffer.platform !== EPlatform.desktop && externalOffer.device !== EDevice.iphone_ipad);
        internalOffer.isIos = +(externalOffer.platform !== EPlatform.desktop && externalOffer.device === EDevice.iphone_ipad);
        internalOffer.offerUrlTemplate = externalOffer.offer_url;
        internalOffer.providerName = "offer1";
        internalOffer.externalOfferId = externalOffer.offer_id;

        return internalOffer;
    }
}
