import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import {
  AuthGuard,
  AuthorizedRequest,
  USERNAME_REQUEST_PROPERTY,
} from "../auth/auth.guard";
import { AUTHORIZATION_HEADER } from "../auth/constants";
import { CreateSpaceDto } from "./dto/create-space.dto";
import { UpdateSpaceDto } from "./dto/update-space.dto";
import { SpaceService } from "./space.service";

@Controller("space")
@ApiTags("SpaceCRUD")
@UseGuards(AuthGuard)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@ApiBearerAuth(AUTHORIZATION_HEADER)
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  create(
    @Body() createSpaceDto: CreateSpaceDto,
    @Req() request: AuthorizedRequest,
  ) {
    return this.spaceService.create(
      createSpaceDto,
      request[USERNAME_REQUEST_PROPERTY],
    );
  }

  @Get()
  async findAll(@Req() request: AuthorizedRequest) {
    return {
      spaces: await this.spaceService.findAllOwnedBy(
        request[USERNAME_REQUEST_PROPERTY],
      ),
    };
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.spaceService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateSpaceDto: UpdateSpaceDto) {
    return this.spaceService.update(+id, updateSpaceDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.spaceService.remove(+id);
  }
}
