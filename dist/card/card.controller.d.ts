/// <reference types="short-uuid" />
import { CardService } from "./card.service";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
export declare class CardController {
    private readonly cardService;
    constructor(cardService: CardService);
    create(createCardDto: CreateCardDto): Promise<{
        cardID: import("short-uuid").SUUID;
        spaceID: string;
        name: string;
        parentTaskID?: string | undefined;
        attributes: {
            [key: string]: string | number | boolean | null;
        };
    }>;
    findAll(): Promise<{
        [x: string]: any;
        [x: number]: any;
        [x: symbol]: any;
    }[] | undefined>;
    findOne(id: string): Promise<import("./entities/card.entity").Card | null>;
    update(id: string, updateCardDto: UpdateCardDto): Promise<Record<string, any> | undefined>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=card.controller.d.ts.map