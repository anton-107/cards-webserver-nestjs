import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { SpaceDynamoDBTableFactory } from "./entities/space.dynamodb";
import { SpaceController } from "./space.controller";
import { SpaceService } from "./space.service";

@Module({
  controllers: [SpaceController],
  providers: [SpaceService, SpaceDynamoDBTableFactory],
  imports: [AuthModule],
})
export class SpaceModule {}
