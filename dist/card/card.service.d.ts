import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
export declare class CardService {
    create(createCardDto: CreateCardDto): Promise<void>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCardDto: UpdateCardDto): string;
    remove(id: number): string;
}
//# sourceMappingURL=card.service.d.ts.map