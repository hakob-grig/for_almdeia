import { Offer } from "../../../entities/offer.entity";

export interface IOfferProvider {
    getOffers(): Promise<Offer[]>;
}
