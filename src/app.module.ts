import { Module } from '@nestjs/common';
import { OfferPollerService } from "./services/offer-poller.service";
import { IntegrationAConnectorService } from "./services/connectors/integrationA/integrationA-connector.service";
import { IntegrationBConnectorService } from "./services/connectors/integrationB/integrationB-connector.service";


@Module({
  imports: [],
  controllers: [],
  providers: [
      OfferPollerService,
      IntegrationAConnectorService,
      IntegrationBConnectorService,
  ],
})
export class AppModule {}
