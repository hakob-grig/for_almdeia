import { Injectable } from '@nestjs/common';
import { IntegrationAConnectorService } from "./connectors/integrationA/integrationA-connector.service";
import { IntegrationBConnectorService } from "./connectors/integrationB/integrationB-connector.service";
import { IOfferProvider } from "./connectors/interfaces/offer-provider.interface";
import { IGetName } from "./connectors/interfaces/get-name.interface";
import { Offer } from "../entities/offer.entity";

@Injectable()
export class OfferPollerService {
    // FIXME: Move hardcoded interval value to config file
    private interval = 3000;
    private timeoutID: NodeJS.Timer;

    private offerProviders : (IOfferProvider & IGetName)[] = [];

    constructor(
        private integrationAConnectorService: IntegrationAConnectorService,
        private integrationBConnectorService: IntegrationBConnectorService,
    ) {
        this.offerProviders.push(integrationAConnectorService);
        this.offerProviders.push(integrationBConnectorService);
        this.startTimer();
    }

    startTimer() {
        this.timeoutID = setTimeout(async () => {
            await this.poll();
            if (1) { // all good?
                this.startTimer();
            }
        }, this.interval);
    }

    async poll() {
        let allOffers: Offer[] = [];
        await Promise.allSettled(
            this.offerProviders.map(async (provider) => {
                try {
                    const offers = await provider.getOffers();
                    allOffers.push(...offers);
                } catch (e) {
                    console.log(`Got error from: ${provider.getName()}`, e);
                }
            })
        );
        if (allOffers.length) {
            console.log('\n\n');
            console.log(`Got ${allOffers.length} new offers`);
            allOffers.forEach((offer) => {
                console.log( offer);
            });
            console.log('\n\n');
        }
    }
}
