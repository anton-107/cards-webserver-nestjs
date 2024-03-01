import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "../auth/auth.module";
import { SpaceDynamoDBTableFactory } from "./entities/space.dynamodb";
import { SpaceController } from "./space.controller";
import { SpaceService } from "./space.service";

@Module({
  controllers: [SpaceController],
  providers: [SpaceService, SpaceDynamoDBTableFactory],
  imports: [forwardRef(() => AuthModule), ConfigModule],
  exports: [SpaceService, SpaceDynamoDBTableFactory],
})
export class SpaceModule {}
