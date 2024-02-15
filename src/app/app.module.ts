import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { CardsModule } from "../cards/cards.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [AuthModule, CardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
