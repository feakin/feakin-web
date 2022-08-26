import { TriangleShape } from "./triangle-shape";

describe('Triangle Shape', () => {
  it('calculate points', function () {
    const shape = new TriangleShape(0, 0, 100, 100);
    expect(shape.points().length).toBe(4);
    expect(shape.points()).toEqual([
      { "x": 50, "y": 0 },
      { "x": 100, "y": 100 },
      { "x": 0, "y": 100 },
      { "x": 50, "y": 0 }
    ]);
  });
});
