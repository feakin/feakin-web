import { Point } from "../geometry/point";
import { PolygonShape } from "./polygon-shape";
import { ShapeType } from "./base/shape-type";

export class TriangleShape extends PolygonShape {
  override type = ShapeType.Triangle;

  constructor(x = 0, y = 0, width = 0, height = 0) {
    super(x, y, width, height);
  }

  override points(): Point[] {
    const width = this.width;
    const height = this.height;

    const points = [
      { x: 0.5 * width, y: 0 },
      { x: width, y: height },
      { x: 0, y: height }
    ]

    return [...points, points[0]];
  }

  override labelPosition() {
    const width = this.width;
    const height = this.height;

    return { x: this.x + width / 2, y: this.y + height / 2 };
  }
}
