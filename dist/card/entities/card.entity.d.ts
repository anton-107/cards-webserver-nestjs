export interface Card {
    spaceID: string;
    id: string;
    type: string;
    name: string;
    parentTaskID: string | null;
    attributes: {
        [key: string]: string | number | boolean | null;
    };
}
//# sourceMappingURL=card.entity.d.ts.map