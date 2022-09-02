import { EdgeProperty, Point } from "@feakin/exporter";

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
