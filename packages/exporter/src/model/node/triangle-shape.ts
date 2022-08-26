import { Shape, ShapeType } from "./shape";
import { Point } from "../geometry/point";

export class TriangleShape extends Shape {
  override type = ShapeType.Triangle;
  width: number;
  height: number;

  constructor(x = 0, y = 0, width = 0, height = 0) {
    super(x, y);
    this.width = width;
    this.height = height;
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
