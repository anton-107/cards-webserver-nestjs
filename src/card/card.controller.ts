import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CardService } from "./card.service";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";

@Controller("card")
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  async create(@Body() createCardDto: CreateCardDto) {
    return await this.cardService.create(createCardDto);
  }

  @Get()
  async findAll() {
    return await this.cardService.findAll("space-1");
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.cardService.findOne("space-1", id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update("space-1", id, updateCardDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.cardService.remove("space-1", id);
  }
}
