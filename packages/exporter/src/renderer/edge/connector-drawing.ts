import { Point } from "../../model/geometry/point";
import { EdgeProperty } from "../../model/graph";
import { LineDashStyleImpl } from "../../model/edge/decorator/line-dash-style";
import { LineType } from "../../model/edge/decorator/line-type";
import { Arrowhead } from "../../model/edge/decorator/arrowhead";

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
    const scale = 1;
    // todo: refactor to endArrowhead
    const pts: Point[] = [];

    for (let i = 0; i < points.length; i += 1) {
      const p = points[i];

      if (p) {
        pts.push({
          x: p.x / scale,
          y: p.y / scale
        })
      }
    }

    console.log(arrowhead);
    switch (arrowhead) {
      case Arrowhead.NONE:
        break;
      case Arrowhead.NOTCHED:
        // create arrowhead with direction by start points
        ConnectorDrawing.drawingFacingArrow(ctx, pts, source);
        break;
      default:
        ConnectorDrawing.drawingFacingArrow(ctx, pts, source);
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


  /**
   * Copyright (c) 2006-2015, JGraph Ltd
   * Copyright (c) 2006-2015, Gaudenz Alder
   * Updated to ES9 syntax by David Morrissey 2021
   * Type definitions from the typed-mxgraph project
   */
  private static drawingFacingArrow(canvas: CanvasRenderingContext2D, points: Point[], source: boolean) {
    const widthFactor = 2;
    const strokeWidth = 2;
    const size = 4;

    const length = points.length;
    let p0 = source ? points[1] : points[length - 2];
    const pe = source ? points[0] : points[length - 1];

    let count = 1;

    // Uses next non-overlapping point
    while (
      count < length - 1 &&
      Math.round(p0.x - pe.x) === 0 &&
      Math.round(p0.y - pe.y) === 0
      ) {
      p0 = source ? points[1 + count] : points[length - 2 - count];
      count++;
    }

    // Computes the norm and the inverse norm
    const dx = pe.x - p0.x;
    const dy = pe.y - p0.y;

    const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));

    let unitX = dx / dist;
    let unitY = dy / dist;

    // The angle of the forward facing arrow sides against the x axis is
    // 26.565 degrees, 1/sin(26.565) = 2.236 / 2 = 1.118 ( / 2 allows for
    // only half the strokewidth is processed ).
    const endOffsetX = unitX * strokeWidth * 1.118;
    const endOffsetY = unitY * strokeWidth * 1.118;

    unitX *= size + strokeWidth;
    unitY *= size + strokeWidth;

    const pt = {
      x: pe.x - endOffsetX,
      y: pe.y - endOffsetY
    };

    // const f = type !== ARROW.CLASSIC && type !== ARROW.CLASSIC_THIN ? 1 : 3 / 4;
    const f = 1;
    pe.x += -unitX * f - endOffsetX;
    pe.y += -unitY * f - endOffsetY;

    canvas.beginPath();
    canvas.moveTo(pt.x, pt.y);
    canvas.moveTo(
      pt.x - unitX - unitY / widthFactor,
      pt.y - unitY + unitX / widthFactor
    );
    canvas.lineTo(pt.x, pt.y);
    canvas.lineTo(
      pt.x + unitY / widthFactor - unitX,
      pt.y - unitY - unitX / widthFactor
    );

    canvas.closePath();
    canvas.fill();
    canvas.stroke();
  }
}
