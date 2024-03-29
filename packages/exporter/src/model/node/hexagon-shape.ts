import { Point } from "../geometry/point";
import { ShapeType } from "./base/shape-type";
import { PolygonShape } from "./polygon-shape";

export class HexagonShape extends PolygonShape {
  override type = ShapeType.Hexagon;

  constructor(x = 0, y = 0, width = 0, height = 0) {
    super(x, y, width, height);
  }

  override points(): Point[] {
    const width = this.width;
    const height = this.height;

    const points = [
      { x: 0.25 * width, y: 0 },
      { x: 0.75 * width, y: 0 },
      { x: width, y: 0.5 * height },
      { x: 0.75 * width, y: height },
      { x: 0.25 * width, y: height },
      { x: 0, y: 0.5 * height }
    ]

    return [...points, points[0]];
  }
}
