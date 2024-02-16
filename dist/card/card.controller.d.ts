import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
export declare class CardController {
    private readonly cardService;
    constructor(cardService: CardService);
    create(createCardDto: CreateCardDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCardDto: UpdateCardDto): string;
    remove(id: string): string;
}
//# sourceMappingURL=card.controller.d.ts.map