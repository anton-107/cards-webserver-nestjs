import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { SpaceModule } from "../space/space.module";
import { CardController } from "./card.controller";
import { CardService } from "./card.service";
import { CardDynamoDBTableFactory } from "./entities/card.dynamodb";

@Module({
  controllers: [CardController],
  providers: [CardService, CardDynamoDBTableFactory],
  imports: [AuthModule, SpaceModule],
})
export class CardModule {}
