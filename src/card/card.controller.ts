import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { AuthGuard } from "../auth/auth.guard";
import { AUTHORIZATION_HEADER } from "../auth/constants";
import { PermissionsGuard } from "../auth/permissions/permission.guard";
import { Permissions } from "../auth/permissions/permissions.decorator";
import { CardService } from "./card.service";
import { CardIdentity } from "./dto/card-identity.dto";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
import { UpdateCardAttributesDto } from "./dto/update-card-attributes.dto";
import { ValidateSpacePipe } from "./pipes/validate-space.pipe";
import { ValidateTypePipe } from "./pipes/validate-type.pipe";

@Controller("card")
@ApiTags("CardsCRUD")
@UseGuards(AuthGuard)
@ApiBearerAuth(AUTHORIZATION_HEADER)
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post("/:type")
  async create(
    @Param("type", new ValidateTypePipe()) type: string,
    @Body() createCardDto: CreateCardDto,
  ) {
    return await this.cardService.create(type, createCardDto);
  }

  @Get("/list/:spaceID/:type")
  @UseGuards(PermissionsGuard)
  @Permissions("list_cards_in_requested_space")
  async findAllInSpace(
    @Param("spaceID", new ValidateSpacePipe()) spaceID: string,
    @Param("type", new ValidateTypePipe()) type: string,
  ) {
    return await this.cardService.findAllOfType(spaceID, type);
  }

  @Get("/:type/children-of/:parentID")
  async findChildren(
    @Param("type", new ValidateTypePipe()) type: string,
    @Param("parentID") parentID: string,
  ) {
    return await this.cardService.findAllOfTypeForParent(
      "space-1",
      type,
      parentID,
    );
  }

  @Get("/:type/:id")
  async findOne(
    @Param("type", new ValidateTypePipe()) type: string,
    @Param("id") id: string,
  ) {
    const card = await this.cardService.findOneOfType("space-1", type, id);

    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found.`);
    }

    return card;
  }

  @Patch("/:type/:id")
  async update(
    @Param("type", new ValidateTypePipe()) type: string,
    @Param("id") id: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return await this.cardService.update(
      new CardIdentity("space-1", type, id),
      updateCardDto,
    );
  }

  @Patch("/:type/:id/attributes")
  async updateCardAttributes(
    @Param("type", new ValidateTypePipe()) type: string,
    @Param("id") id: string,
    @Body() updateCardAttributesDto: UpdateCardAttributesDto,
  ) {
    return await this.cardService.updateAttributes(
      new CardIdentity("space-1", type, id),
      updateCardAttributesDto,
    );
  }

  @Delete("/:type/:id")
  remove(
    @Param("type", new ValidateTypePipe()) type: string,
    @Param("id") id: string,
  ) {
    return this.cardService.remove("space-1", type, id);
  }
}
