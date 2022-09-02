import { EdgeProperty } from "../../model/graph";
import { Point } from "../../model/geometry/point";

export class LineDrawing<CV, O> {
  private points: Point[];
  private ctx: CV;
  private props: EdgeProperty;

  constructor(ctx: CV, prop: EdgeProperty, points: Point[]) {
    this.points = points;
    this.ctx = ctx;
    this.props = prop;
  }

  paintLineByType(): O {
    return "" as unknown as O;
  }

  paintPolyline(): O {
    return "" as unknown as O;
  }

  paintCurvedLine(): O {
    return "" as unknown as O;
  }
}
