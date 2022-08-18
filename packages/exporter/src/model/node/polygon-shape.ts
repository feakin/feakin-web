import { Shape } from "./shape";
import { ShapeType } from "./shape-type";
import { Point } from "../geometry/point";

export class PolygonShape extends Shape {
  private readonly points_: Point[];

  override type = ShapeType.Polygon;

  constructor(x = 0, y = 0, points: Point[]) {
    super(x, y);
    this.points_ = points
  }

  override calculatePoints(): Point[] {
    return this.points_;
  }
}
