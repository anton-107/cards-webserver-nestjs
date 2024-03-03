"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_space_pipe_1 = require("./validate-space.pipe");
describe("Validate Space pipe", () => {
    it("should allow dashes in the middle of the word", () => {
        const pipe = new validate_space_pipe_1.ValidateSpacePipe();
        const r = pipe.transform("space-1");
        expect(r).toBe("space-1");
    });
});
