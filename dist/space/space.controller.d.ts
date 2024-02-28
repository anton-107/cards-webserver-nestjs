import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
export declare class SpaceController {
    private readonly spaceService;
    constructor(spaceService: SpaceService);
    create(createSpaceDto: CreateSpaceDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateSpaceDto: UpdateSpaceDto): string;
    remove(id: string): string;
}
//# sourceMappingURL=space.controller.d.ts.map