import { Point } from "../geometry/point";
import { PolygonShape } from "./polygon-shape";
import { ShapeType } from "./base/shape-type";

/**
 * Diamond aka Rhombus.
 */
export class DiamondShape extends PolygonShape {
  override type = ShapeType.Diamond;

  constructor(x = 0, y = 0, width = 0, height = 0) {
    super(x, y, width, height);
  }

  override points(): Point[] {
    const width = this.width;
    const height = this.height;

    const points = [
      { x: 0.5 * width, y: 0 },
      { x: width, y: 0.5 * height },
      { x: 0.5 * width, y: height },
      { x: 0, y: 0.5 * height }
    ]

    return [...points, points[0]];
  }
}
