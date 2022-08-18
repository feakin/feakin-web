import { Shape } from "../node";
import { Point } from "../geometry/point";

export class ArrowShape extends Shape {
  private points: Point[];

  constructor(points: Point[]) {
    super();
    this.points = points;
  }
}
