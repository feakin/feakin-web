import { EdgeProperty } from "../../model/graph";
import { Point } from "../../model/geometry/point";

export class ConnectorDrawing<CV, O> {
  private points: Point[];
  private props: EdgeProperty;
  private ctx: CV;

  constructor(ctx: CV, props: EdgeProperty, points: Point[] = []) {
    this.props = props;
    this.ctx = ctx;
    this.points = points;
  }

  render(): O {
    return "" as unknown as O;
  }

  paintStartMarker(): O {
    return this.paintMarker(true);
  }

  paintEndMarker(): O {
    return this.paintMarker(false);
  }

  protected paintMarker(source: boolean): O {
    return "" as unknown as O;
  }
}
