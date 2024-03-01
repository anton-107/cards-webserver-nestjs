import { CardIdentity } from "./dto/card-identity.dto";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
import { UpdateCardAttributesDto } from "./dto/update-card-attributes.dto";
import { Card } from "./entities/card.entity";
import { CardDynamoDBTableFactory } from "./entities/card.dynamodb";
export declare class CardService {
    private table;
    constructor(cardDynamoDBTableFactory: CardDynamoDBTableFactory);
    create(type: string, createCardDto: CreateCardDto): Promise<Card>;
    findAllOfType(spaceID: string, type: string): Promise<Card[] | undefined>;
    findAllOfTypeForParent(spaceID: string, type: string, parentID: string): Promise<Card[] | undefined>;
    findOneOfType(spaceID: string, type: string, cardID: string): Promise<Card | null>;
    update(cardIdentity: CardIdentity, updateCardDto: UpdateCardDto): Promise<Record<string, any> | undefined>;
    updateAttributes(cardIdentity: CardIdentity, updateCardAttributesDto: UpdateCardAttributesDto): Promise<Record<string, any> | undefined>;
    remove(spaceID: string, type: string, cardID: string): Promise<{
        message: string;
    }>;
    private convertToCard;
}
//# sourceMappingURL=card.service.d.ts.map