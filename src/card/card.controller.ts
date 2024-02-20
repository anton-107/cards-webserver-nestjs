import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CardService } from "./card.service";
import { CardIdentity } from "./dto/card-identity.dto";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
import { ValidateTypePipe } from "./pipes/validate-type.pipe";

@Controller("card")
@ApiTags("CardsCRUD")
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post("/:type")
  async create(
    @Param("type", new ValidateTypePipe()) type: string,
    @Body() createCardDto: CreateCardDto,
  ) {
    return await this.cardService.create(type, createCardDto);
  }

  @Get("/:type")
  async findAll(@Param("type", new ValidateTypePipe()) type: string) {
    return await this.cardService.findAllOfType("space-1", type);
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
  update(
    @Param("type", new ValidateTypePipe()) type: string,
    @Param("id") id: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardService.update(
      new CardIdentity("space-1", type, id),
      updateCardDto,
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
