import { Shape } from "../node";
import { Point } from "../geometry/point";
import { ShapeType } from "../node/shape-type";
import { ArrowType } from "./edge-type";

export class ArrowShape extends Shape {
  private points_: Point[];

  override type = ShapeType.Arrow;

  constructor(points: Point[]) {
    super();
    this.points_ = points;
  }


  // for build arrow;
  lineStart = ArrowType.NONE;
  lineEnd = ArrowType.NONE;
  // add relationships for start and end;
  lineType(): string {
    switch (this.lineStart) {
      case ArrowType.NONE:
        break;
    }
    return ""
  }
}
