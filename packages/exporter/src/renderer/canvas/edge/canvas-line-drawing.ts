import { LineDashStyleImpl } from "../../../model/edge/decorator/line-dash-style";
import { LineStyle } from "../../../model/edge/decorator/line-style";
import { EdgeProperty } from "../../../model/graph";
import { Point } from "../../../model/geometry/point";
import { LineDrawing } from "../../base/line-drawing";

export class CanvasLineDrawing extends LineDrawing<CanvasRenderingContext2D, void>{
  constructor(ctx: CanvasRenderingContext2D, prop: EdgeProperty, points: Point[]) {
    super(ctx, prop, points);
  }

  override paintLineByType() {
    const startPoint = (this.points)[0];

    this.ctx.beginPath();
    this.ctx.moveTo(startPoint.x, startPoint.y);

    const dashPattern = LineDashStyleImpl.toCanvasDashLine(this.props.decorator!.lineDashStyle, this.props.stroke?.width || 1);
    this.ctx.setLineDash(dashPattern);

    switch (this.props.decorator?.lineType) {
      case LineStyle.SCRIBBLE:
      case LineStyle.STRAIGHT:
      case LineStyle.POLYLINE:
        this.paintPolyline();
        break;
      case LineStyle.CURVED:
        this.paintCurvedLine();
        break;
    }
    return this.ctx.stroke();
  }

  override paintPolyline() {
    for (const item of this.points) {
      this.ctx.lineTo(item.x, item.y);
    }
  }

  override paintCurvedLine() {
    const length = this.points.length;

    for (let i = 1; i < length - 2; i += 1) {
      const p0 = (this.points)[i];
      const p1 = (this.points)[i + 1];
      const ix = (p0.x + p1.x) / 2;
      const iy = (p0.y + p1.y) / 2;
      this.ctx.quadraticCurveTo(p0.x, p0.y, ix, iy);
    }

    const p0 = (this.points)[length - 2];
    const p1 = (this.points)[length - 1];
    return this.ctx.quadraticCurveTo(p0.x, p0.y, p1.x, p1.y);
  }
}
