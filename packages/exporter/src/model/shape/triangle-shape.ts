import { Shape } from "./shape";
import { ShapeType } from "./shape-type";
import { Point } from "../geometry/point";

export class TriangleShape extends Shape {
  override type = ShapeType.Circle;
  private readonly width: number;
  private readonly height: number;

  constructor(x = 0, y = 0, width = 0, height = 0) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

  override points(): Point[] {
    const width = this.width;
    const height = this.height;

    const points = [
      { x: 0, y: 0 },
      { x: width, y: 0.5 * height },
      { x: 0, y: height }
    ]

    return [...points, points[0]];
  }
}
