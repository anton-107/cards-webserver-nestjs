import { CardIdentity } from "./dto/card-identity.dto";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
import { UpdateCardAttributesDto } from "./dto/update-card-attributes.dto";
import { CardDynamoDBTableFactory } from "./entities/card.dynamodb";
import { Card } from "./entities/card.entity";
export declare class CardService {
    private table;
    constructor(cardDynamoDBTableFactory: CardDynamoDBTableFactory);
    create(type: string, createCardDto: CreateCardDto): Promise<Card>;
    findAllOfType(spaceID: string, type: string): Promise<Card[] | undefined>;
    findAllOfTypeForParent(spaceID: string, type: string, parentID: string): Promise<Card[] | undefined>;
    findOneOfType(spaceID: string, type: string, cardID: string): Promise<Card | null>;
    update(cardIdentity: CardIdentity, updateCardDto: UpdateCardDto): Promise<import("ts-toolbelt/out/Object/Pick")._Pick<{
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
    updateAttributes(cardIdentity: CardIdentity, updateCardAttributesDto: UpdateCardAttributesDto): Promise<import("ts-toolbelt/out/Object/Pick")._Pick<{
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
    remove(spaceID: string, type: string, cardID: string): Promise<{
        message: string;
    }>;
    private convertToCard;
}
//# sourceMappingURL=card.service.d.ts.map