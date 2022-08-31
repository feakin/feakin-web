import { Point } from "../../model/geometry/point";
import { EdgeProperty } from "../../model/graph";
import { LineDashStyleImpl } from "../../model/edge/decorator/line-dash-style";
import { LineType } from "../../model/edge/decorator/line-type";
import { Arrowhead } from "../../model/edge/decorator/arrowhead";
import { drawingFacingArrow } from "./marker-shape";

export class ConnectorDrawing {
  static render(ctx: CanvasRenderingContext2D, props: EdgeProperty, points: Point[]): void {
    ctx.strokeStyle = props.stroke?.color || '#000000';
    ctx.lineWidth = props.stroke?.width || 1;

    ConnectorDrawing.createStartMarker(ctx, points, props);
    ConnectorDrawing.createEndMarker(ctx, points, props);

    // todo: remove offset of arrow size;
    ConnectorDrawing.paintLine(ctx, points, props);
  }

  static createStartMarker(ctx: CanvasRenderingContext2D, points: Point[], decorator: EdgeProperty) {
    ConnectorDrawing.createArrowMarker(ctx, points, decorator, true);
  }

  static createEndMarker(ctx: CanvasRenderingContext2D, points: Point[], decorator: EdgeProperty) {
    ConnectorDrawing.createArrowMarker(ctx, points, decorator, false);
  }

  static createArrowMarker(ctx: CanvasRenderingContext2D, points: Point[], prop: EdgeProperty, source: boolean) {
    ConnectorDrawing.createByType(prop.decorator!.startArrowhead, ctx, points, source);
  }

  private static createByType(arrowhead: Arrowhead, ctx: CanvasRenderingContext2D, points: Point[], source: boolean) {
    switch (arrowhead) {
      case Arrowhead.NONE:
        break;
      case Arrowhead.NOTCHED:
        drawingFacingArrow(ctx, points, source);
        break;
      default:
        drawingFacingArrow(ctx, points, source);
    }
  }

  private static paintLine(ctx: CanvasRenderingContext2D, points: Point[], prop: EdgeProperty) {
    const length = points.length;

    const startPoint = points[0];
    const endPoint = points[length - 1];
    const controlPoints: Point[] = [];

    ctx.beginPath();

    ctx.moveTo(startPoint.x, startPoint.y);

    const dashPattern = LineDashStyleImpl.toCanvasDashLine(prop.decorator!.lineDashStyle, prop.stroke?.width || 1);
    ctx.setLineDash(dashPattern);

    switch (prop.decorator?.lineType) {
      case LineType.SCRIBBLE:
      case LineType.LINE:
      case LineType.POLYLINE:
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        break;
      case LineType.CURVE:
        for (let i = 1; i < length - 1; i += 1) {
          const point = points[i];
          controlPoints.push(point);
        }

        ctx.bezierCurveTo(controlPoints[0].x, controlPoints[0].y, controlPoints[1].x, controlPoints[1].y, endPoint.x, endPoint.y);
        break;
    }

    ctx.stroke();
  }
}
