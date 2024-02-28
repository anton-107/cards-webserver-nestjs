"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const space_service_1 = require("./space.service");
describe('SpaceService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [space_service_1.SpaceService],
        }).compile();
        service = module.get(space_service_1.SpaceService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
