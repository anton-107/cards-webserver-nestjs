import { ValidateSpacePipe } from "./validate-space.pipe";

describe("Validate Space pipe", () => {
  it("should allow dashes in the middle of the word", () => {
    const pipe = new ValidateSpacePipe();
    const r = pipe.transform("space-1");
    expect(r).toBe("space-1");
  });
});
