import { LineDashStyleImpl } from "../../../model/edge/decorator/line-dash-style";
import { LineStyle } from "../../../model/edge/decorator/line-style";
import { EdgeProperty } from "../../../model/graph";
import { Point } from "../../../model/geometry/point";
import { LineDrawing } from "../../base/line-drawing";

export class CanvasLineDrawing extends LineDrawing<CanvasRenderingContext2D, null>{
  constructor(ctx: CanvasRenderingContext2D, prop: EdgeProperty, points: Point[]) {
    super(ctx, prop, points);
  }

  static paintLineByType(ctx: CanvasRenderingContext2D, prop: EdgeProperty, points: Point[]) {
    const startPoint = points[0];

    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);

    const dashPattern = LineDashStyleImpl.toCanvasDashLine(prop.decorator!.lineDashStyle, prop.stroke?.width || 1);
    ctx.setLineDash(dashPattern);

    switch (prop.decorator?.lineType) {
      case LineStyle.SCRIBBLE:
      case LineStyle.STRAIGHT:
      case LineStyle.POLYLINE:
        this.paintPolyline(points, ctx);
        break;
      case LineStyle.CURVED:
        this.paintCurvedLine(ctx, points);
        break;
    }

    ctx.stroke();
  }

  private static paintPolyline(points: Point[], ctx: CanvasRenderingContext2D) {
    for (const item of points) {
      ctx.lineTo(item.x, item.y);
    }
  }

  private static paintCurvedLine(ctx: CanvasRenderingContext2D, newPoints: Point[]) {
    const length = newPoints.length;

    for (let i = 1; i < length - 2; i += 1) {
      const p0 = newPoints[i];
      const p1 = newPoints[i + 1];
      const ix = (p0.x + p1.x) / 2;
      const iy = (p0.y + p1.y) / 2;
      ctx.quadraticCurveTo(p0.x, p0.y, ix, iy);
    }

    const p0 = newPoints[length - 2];
    const p1 = newPoints[length - 1];
    ctx.quadraticCurveTo(p0.x, p0.y, p1.x, p1.y);
  }
}
