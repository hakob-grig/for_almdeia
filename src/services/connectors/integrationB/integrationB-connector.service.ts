import { Injectable } from '@nestjs/common';
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { v4 as uuidv4 } from "uuid";

import { IOfferProvider } from "../interfaces/offer-provider.interface";
import { IGetName } from "../interfaces/get-name.interface";

import { Offer } from "../../../entities/offer.entity";
import {
    GetOfferResponseDto,
    OfferWrapper as IntegrationBOffer
} from "./models/get-offer-response.dto";
import { getOffersResponse } from "./mockdata/get-offers-response.data"

@Injectable()
export class IntegrationBConnectorService implements IOfferProvider, IGetName {
    constructor() {
    }

    public getName() {
        return "IntegrationB";
    }

    public async getOffers() : Promise<Offer[]> {
        const response : GetOfferResponseDto = plainToInstance(GetOfferResponseDto, getOffersResponse);
        const responseValidationResults = await validate(response);
        if (responseValidationResults.length) {
            throw new Error(`Invalid response from ${this.getName()}`);
        }

        const validExternalOffers : IntegrationBOffer[] = [];

        await Promise.allSettled(
            Array.from(response.data.values()).map(async (plainOfferWrapper) => {
                const offerWrapper: IntegrationBOffer = plainToInstance(IntegrationBOffer, plainOfferWrapper);
                const offerWrapperValidationResults = await validate(offerWrapper);
                if (!offerWrapperValidationResults.length) {
                    validExternalOffers.push(offerWrapper);
                } else {
                    console.log(`Invalid order, integration: ${this.getName()}, id: ${offerWrapper?.Offer?.campaign_id}`);
                }
            })
        );

        return validExternalOffers.map((offer) => this.transformOfferToInternalEntity(offer));
    }

    private transformOfferToInternalEntity(wrapper: IntegrationBOffer): Offer {
        const internalOffer = new Offer();

        internalOffer.name = wrapper.Offer.name;
        internalOffer.slug = uuidv4();
        internalOffer.description = wrapper.Offer.description;
        internalOffer.requirements = wrapper.Offer.instructions;
        internalOffer.thumbnail = wrapper.Offer.icon;
        internalOffer.isDesktop = +wrapper.OS.web;
        internalOffer.isAndroid = +wrapper.OS.android;
        internalOffer.isIos = +wrapper.OS.ios;
        internalOffer.offerUrlTemplate = wrapper.Offer.tracking_url;
        internalOffer.providerName = "offer2";
        internalOffer.externalOfferId = String(wrapper.Offer.campaign_id);

        return internalOffer;
    }
}
