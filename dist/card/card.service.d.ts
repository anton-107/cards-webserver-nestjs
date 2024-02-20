import { CardIdentity } from "./dto/card-identity.dto";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
import { Card } from "./entities/card.entity";
export declare class CardService {
    private documentClient;
    private cardEntity;
    constructor();
    create(type: string, createCardDto: CreateCardDto): Promise<Card>;
    findAllOfType(spaceID: string, type: string): Promise<Card[] | undefined>;
    findAllOfTypeForParent(spaceID: string, type: string, parentID: string): Promise<Card[] | undefined>;
    findOneOfType(spaceID: string, type: string, cardID: string): Promise<Card | null>;
    update(cardIdentity: CardIdentity, updateCardDto: UpdateCardDto): Promise<Record<string, any> | undefined>;
    remove(spaceID: string, type: string, cardID: string): Promise<{
        message: string;
    }>;
    private convertToCard;
}
//# sourceMappingURL=card.service.d.ts.map