import { FontString, measureText } from "./text-utils";

describe('TextUtil', () => {
  it('should return true when color is rgb transparent', () => {
    expect(measureText("Hello, World", "20px Helvetica" as FontString)).toEqual({
      "baseline": 0,
      "height": 0,
      "width": 0
    });
  });
});
