import { AuthorizedRequest } from "../auth/auth.guard";
import { CreateSpaceDto } from "./dto/create-space.dto";
import { UpdateSpaceDto } from "./dto/update-space.dto";
import { SpaceService } from "./space.service";
export declare class SpaceController {
    private readonly spaceService;
    constructor(spaceService: SpaceService);
    create(createSpaceDto: CreateSpaceDto, request: AuthorizedRequest): Promise<import("./entities/space.entity").Space>;
    findAll(request: AuthorizedRequest): Promise<{
        spaces: {
            [x: string]: any;
        }[] | undefined;
    }>;
    findOne(id: string): Promise<import("./entities/space.entity").Space | null>;
    update(id: string, updateSpaceDto: UpdateSpaceDto): string;
    remove(id: string): string;
}
//# sourceMappingURL=space.controller.d.ts.map