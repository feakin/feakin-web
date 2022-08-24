import { NodeImpl } from "./node-impl";
import { ShapeType } from "./node/shape";

describe('NodeImpl', () => {
  it('sample', () => {
    const node = new NodeImpl('id', 'label');
    const shapeType = node.shapeFromString("triangle");
    expect(shapeType).toBe(ShapeType.Triangle);
  });
});
