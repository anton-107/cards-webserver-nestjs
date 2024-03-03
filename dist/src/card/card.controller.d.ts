import { CardService } from "./card.service";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
import { UpdateCardAttributesDto } from "./dto/update-card-attributes.dto";
export declare class CardController {
    private readonly cardService;
    constructor(cardService: CardService);
    create(type: string, createCardDto: CreateCardDto): Promise<import("./entities/card.entity").Card>;
    findAllInSpace(spaceID: string, type: string): Promise<import("./entities/card.entity").Card[] | undefined>;
    findChildren(spaceID: string, type: string, parentID: string): Promise<import("./entities/card.entity").Card[] | undefined>;
    findOne(spaceID: string, type: string, id: string): Promise<import("./entities/card.entity").Card>;
    update(type: string, id: string, updateCardDto: UpdateCardDto): Promise<import("ts-toolbelt/out/Object/Pick")._Pick<{
        type?: string | undefined;
        id?: string | undefined;
        name?: string | undefined;
        parentCardID?: string | undefined;
        attributes?: any;
        spaceID: any;
        cardID: any;
        created: string;
        modified: string;
        entity: string;
    }, "type" | "spaceID" | "cardID" | "id" | "name" | "parentCardID" | "attributes" | "created" | "modified" | "entity"> | undefined>;
    updateCardAttributes(type: string, id: string, updateCardAttributesDto: UpdateCardAttributesDto): Promise<import("ts-toolbelt/out/Object/Pick")._Pick<{
        type?: string | undefined;
        id?: string | undefined;
        name?: string | undefined;
        parentCardID?: string | undefined;
        attributes?: any;
        spaceID: any;
        cardID: any;
        created: string;
        modified: string;
        entity: string;
    }, "type" | "spaceID" | "cardID" | "id" | "name" | "parentCardID" | "attributes" | "created" | "modified" | "entity"> | undefined>;
    remove(spaceID: string, type: string, id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=card.controller.d.ts.map