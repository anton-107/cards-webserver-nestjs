import { ValidateTypePipe } from "./validate-type.pipe";

describe("Validate Type pipe", () => {
  it("should allow dashes in the middle of the word", () => {
    const pipe = new ValidateTypePipe();
    const r = pipe.transform("todo-item");
    expect(r).toBe("todo-item");
  });
});
