import { Point } from "../../../model/geometry/point";
import { EdgeProperty } from "../../../model/graph";
import { renderMarker } from "./marker-shape";
import { LineDrawing } from "./line-drawing";

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

    LineDrawing.paintLine(ctx, props, pts);
  }

  static createStartMarker(ctx: CanvasRenderingContext2D, points: Point[], decorator: EdgeProperty) {
    ConnectorDrawing.createByType(decorator, ctx, points, true);
  }

  static createEndMarker(ctx: CanvasRenderingContext2D, points: Point[], decorator: EdgeProperty) {
    ConnectorDrawing.createByType(decorator, ctx, points, false);
  }

  private static createByType(props: EdgeProperty, ctx: CanvasRenderingContext2D, points: Point[], source: boolean) {
    const arrowhead = source ? props.decorator!.startArrowhead : props.decorator!.endArrowhead;
    renderMarker(ctx, arrowhead, points, source, props);
  }
}
