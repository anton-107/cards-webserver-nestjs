import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { CardController } from "./card.controller";
import { CardService } from "./card.service";

@Module({
  controllers: [CardController],
  providers: [CardService],
  imports: [AuthModule],
})
export class CardModule {}
