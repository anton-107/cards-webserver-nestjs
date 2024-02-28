import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
export declare class SpaceService {
    create(createSpaceDto: CreateSpaceDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateSpaceDto: UpdateSpaceDto): string;
    remove(id: number): string;
}
//# sourceMappingURL=space.service.d.ts.map