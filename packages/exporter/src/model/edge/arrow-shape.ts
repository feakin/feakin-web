import { Shape } from "../node";
import { Point } from "../geometry/point";
import { ArrowStyle, ArrowType, defaultArrowStyle } from "./edge-type";
import { ShapeType } from "../node/base/shape-type";

export class ArrowShape extends Shape {
  private points_: Point[];

  override type = ShapeType.Arrow;
  private arrowStyle: ArrowStyle;

  constructor(points: Point[], arrowStyle: ArrowStyle = defaultArrowStyle) {
    super();
    this.points_ = points;
    this.arrowStyle = arrowStyle;
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
