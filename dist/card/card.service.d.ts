import shortUUID from "short-uuid";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
import { Card } from "./entities/card.entity";
export declare class CardService {
    private documentClient;
    private cardEntity;
    constructor();
    create(createCardDto: CreateCardDto): Promise<{
        cardID: shortUUID.SUUID;
        spaceID: string;
        name: string;
        parentTaskID?: string | undefined;
        attributes: {
            [key: string]: string | number | boolean | null;
        };
    }>;
    findAll(spaceID: string): Promise<{
        [x: string]: any;
        [x: number]: any;
        [x: symbol]: any;
    }[] | undefined>;
    findOne(spaceID: string, cardID: string): Promise<Card | null>;
    update(spaceID: string, cardID: string, updateCardDto: UpdateCardDto): Promise<Record<string, any> | undefined>;
    remove(spaceID: string, cardID: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=card.service.d.ts.map