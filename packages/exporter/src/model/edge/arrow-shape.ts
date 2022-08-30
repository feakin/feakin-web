import { Point } from "../geometry/point";
import { ShapeType } from "../node/base/shape-type";
import { defaultEdgeDecorator, EdgeDecorator } from "./decorator/edge-decorator";
import { Arrowhead } from "./decorator/arrowhead";
import { Shape } from "../node/base/shape";

export class ArrowShape extends Shape {
  private points_: Point[];

  override type = ShapeType.Arrow;
  private arrowStyle: EdgeDecorator;

  constructor(points: Point[], arrowStyle: EdgeDecorator = defaultEdgeDecorator) {
    super();
    this.points_ = points;
    this.arrowStyle = arrowStyle;
  }

  // for build arrow;
  lineStart = Arrowhead.NONE;
  lineEnd = Arrowhead.NONE;

  // add relationships for start and end;
  lineType(): string {
    switch (this.lineStart) {
      case Arrowhead.NONE:
        break;
    }
    return ""
  }
}
