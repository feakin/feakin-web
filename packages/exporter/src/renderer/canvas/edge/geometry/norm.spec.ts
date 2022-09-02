import { computeNorm } from "./norm";

describe('Norm', () => {
  it('norm', function () {
    const pointEnd = { x: 0, y: 0 };
    const p0 = { x: 50, y: 50 };

    const { unitX, unitY } = computeNorm(pointEnd, p0);
    expect(unitX).toBe(-0.7071067811865475);
    expect(unitY).toBe(-0.7071067811865475);
  });
});
