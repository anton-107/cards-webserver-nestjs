"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_type_pipe_1 = require("./validate-type.pipe");
describe("Validate Type pipe", () => {
    it("should allow dashes in the middle of the word", () => {
        const pipe = new validate_type_pipe_1.ValidateTypePipe();
        const r = pipe.transform("todo-item");
        expect(r).toBe("todo-item");
    });
});
