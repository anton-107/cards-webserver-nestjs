import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "../auth/auth.module";
import { CardModule } from "../card/card.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    AuthModule,
    CardModule,
    ConfigModule.forRoot({
      isGlobal: true, // This makes the ConfigModule global, so you don't need to import it elsewhere
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
