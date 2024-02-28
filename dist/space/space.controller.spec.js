"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const space_controller_1 = require("./space.controller");
const space_service_1 = require("./space.service");
describe('SpaceController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [space_controller_1.SpaceController],
            providers: [space_service_1.SpaceService],
        }).compile();
        controller = module.get(space_controller_1.SpaceController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
