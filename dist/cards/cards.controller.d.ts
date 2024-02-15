import { CardsService } from './cards.service';
import { NewCardRequestHttpBody } from './cards.dto';
export declare class CardsController {
    private cardsService;
    constructor(cardsService: CardsService);
    createCard(request: NewCardRequestHttpBody): Promise<void>;
}
//# sourceMappingURL=cards.controller.d.ts.map