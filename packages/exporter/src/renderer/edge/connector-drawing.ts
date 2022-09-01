import { Point } from "../../model/geometry/point";
import { EdgeProperty } from "../../model/graph";
import { LineDashStyleImpl } from "../../model/edge/decorator/line-dash-style";
import { LineStyle } from "../../model/edge/decorator/line-style";
import { drawingFacingArrow } from "./marker-shape";

export function insertControlPointsInCenter(points: Point[], controlPoints: Point[]) {
  let mergedPoints: Point[] = [...points];
  if (controlPoints.length > 0) {
    mergedPoints.shift();
    mergedPoints = [points[0], ...controlPoints, ...mergedPoints];
  }
  return mergedPoints;
}

export class ConnectorDrawing {
  static render(ctx: CanvasRenderingContext2D, props: EdgeProperty, points: Point[] = [], controlPoints: Point[] = []): void {
    // todo: refactor to endArrowhead
    const scale = 1;

    const mergedPoints = insertControlPointsInCenter(points, controlPoints);
    const pts: Point[] = [];
    for (let i = 0; i < mergedPoints.length; i++) {
      const p = mergedPoints[i];

      pts.push({
        x: p.x / scale,
        y: p.y / scale
      })
    }

    ctx.strokeStyle = props.stroke?.color || '#000000';
    ctx.lineWidth = props.stroke?.width || 1;
    ctx.fillStyle = props.fill?.color || '#ffffff';

    ConnectorDrawing.createStartMarker(ctx, pts, props);
    ConnectorDrawing.createEndMarker(ctx, pts, props);

    ConnectorDrawing.paintLine(ctx, props, pts);
  }

  static createStartMarker(ctx: CanvasRenderingContext2D, points: Point[], decorator: EdgeProperty) {
    ConnectorDrawing.createByType(decorator, ctx, points, true);
  }

  static createEndMarker(ctx: CanvasRenderingContext2D, points: Point[], decorator: EdgeProperty) {
    ConnectorDrawing.createByType(decorator, ctx, points, false);
  }

  private static createByType(props: EdgeProperty, ctx: CanvasRenderingContext2D, points: Point[], source: boolean) {
    const arrowhead = source ? props.decorator!.startArrowhead : props.decorator!.endArrowhead;
    drawingFacingArrow(ctx, arrowhead, points, source, props);
  }

  private static paintLine(ctx: CanvasRenderingContext2D, prop: EdgeProperty, points: Point[]) {
    const startPoint = points[0];

    ctx.beginPath();

    ctx.moveTo(startPoint.x, startPoint.y);

    const dashPattern = LineDashStyleImpl.toCanvasDashLine(prop.decorator!.lineDashStyle, prop.stroke?.width || 1);
    ctx.setLineDash(dashPattern);

    switch (prop.decorator?.lineType) {
      case LineStyle.SCRIBBLE:
      case LineStyle.LINE:
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        break;
      case LineStyle.POLYLINE:
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        break;
      case LineStyle.CURVED:
        this.drawCurvedLine(ctx, points);
        break;
    }

    ctx.stroke();
  }

  private static drawCurvedLine(ctx: CanvasRenderingContext2D, newPoints: Point[]) {
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
