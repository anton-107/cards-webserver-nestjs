import { CardService } from "./card.service";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
export declare class CardController {
    private readonly cardService;
    constructor(cardService: CardService);
    create(type: string, createCardDto: CreateCardDto): Promise<import("./entities/card.entity").Card>;
    findAll(type: string): Promise<import("./entities/card.entity").Card[] | undefined>;
    findChildren(type: string, parentID: string): Promise<import("./entities/card.entity").Card[] | undefined>;
    findOne(type: string, id: string): Promise<import("./entities/card.entity").Card>;
    update(type: string, id: string, updateCardDto: UpdateCardDto): Promise<Record<string, any> | undefined>;
    remove(type: string, id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=card.controller.d.ts.map