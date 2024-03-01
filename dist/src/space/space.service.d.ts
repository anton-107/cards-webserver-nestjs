import { CreateSpaceDto } from "./dto/create-space.dto";
import { UpdateSpaceDto } from "./dto/update-space.dto";
import { SpaceDynamoDBTableFactory } from "./entities/space.dynamodb";
import { Space } from "./entities/space.entity";
export declare class SpaceService {
    private table;
    constructor(spaceDynamoDBTableFactory: SpaceDynamoDBTableFactory);
    create(createSpaceDto: CreateSpaceDto, owner: string): Promise<Space>;
    findAllOwnedBy(owner: string): Promise<{
        [x: string]: any;
    }[] | undefined>;
    findOne(id: number): string;
    update(id: number, updateSpaceDto: UpdateSpaceDto): string;
    remove(id: number): string;
}
//# sourceMappingURL=space.service.d.ts.map