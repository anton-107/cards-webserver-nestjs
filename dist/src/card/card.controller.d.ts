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
        name?: string | undefined;
        attributes?: any;
        id?: string | undefined;
        parentCardID?: string | undefined;
        spaceID: any;
        created: string;
        modified: string;
        entity: string;
        cardID: any;
    }, "spaceID" | "type" | "name" | "created" | "modified" | "entity" | "attributes" | "id" | "parentCardID" | "cardID"> | undefined>;
    updateCardAttributes(type: string, id: string, updateCardAttributesDto: UpdateCardAttributesDto): Promise<import("ts-toolbelt/out/Object/Pick")._Pick<{
        type?: string | undefined;
        name?: string | undefined;
        attributes?: any;
        id?: string | undefined;
        parentCardID?: string | undefined;
        spaceID: any;
        created: string;
        modified: string;
        entity: string;
        cardID: any;
    }, "spaceID" | "type" | "name" | "created" | "modified" | "entity" | "attributes" | "id" | "parentCardID" | "cardID"> | undefined>;
    remove(spaceID: string, type: string, id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=card.controller.d.ts.map