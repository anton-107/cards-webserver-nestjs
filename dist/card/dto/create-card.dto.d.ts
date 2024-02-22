export type CardAttributeValue = string | number | boolean | null;
export declare class CreateCardDto {
    spaceID: string;
    name: string;
    parentCardID?: string;
    attributes: {
        [key: string]: CardAttributeValue;
    };
}
//# sourceMappingURL=create-card.dto.d.ts.map