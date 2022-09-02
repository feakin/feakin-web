import { EdgeProperty } from "../../model/graph";
import { Point } from "../../model/geometry/point";

export class LineDrawing<CV, O> {
  protected points: Point[];
  protected ctx: CV;
  protected props: EdgeProperty;

  constructor(ctx: CV, prop: EdgeProperty, points: Point[]) {
    this.points = points;
    this.ctx = ctx;
    this.props = prop;
  }

  paint(): O {
    return this.paintLineByType();
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
