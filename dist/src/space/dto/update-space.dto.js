"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSpaceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_space_dto_1 = require("./create-space.dto");
class UpdateSpaceDto extends (0, swagger_1.PartialType)(create_space_dto_1.CreateSpaceDto) {
}
exports.UpdateSpaceDto = UpdateSpaceDto;
