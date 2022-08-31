import { Point } from "../../model/geometry/point";
import { EdgeDecorator } from "@feakin/exporter";
export class ConnectorDrawing {
  static render(ctx: CanvasRenderingContext2D, decorator: EdgeDecorator, points: Point[], size = 1): void {
    const sourceMarker = ConnectorDrawing.createStartMarker(ctx, points, decorator);
    const targetMarker = ConnectorDrawing.createEndMarker(ctx, points, decorator);

    ConnectorDrawing.paintLine(ctx, points, size, decorator);
  }

  static createStartMarker(ctx: CanvasRenderingContext2D, points: Point[], decorator: EdgeDecorator) {
    ConnectorDrawing.createMarker(ctx, points, decorator, true);
  }

  static createEndMarker(ctx: CanvasRenderingContext2D, points: Point[], decorator: EdgeDecorator) {
    ConnectorDrawing.createMarker(ctx, points, decorator, false);
  }

  static createMarker(ctx: CanvasRenderingContext2D, points: Point[], decorator: EdgeDecorator, source: boolean) {
    return {}
  }

  private static paintLine(ctx: CanvasRenderingContext2D, points: Point[], size: number, decorator: EdgeDecorator) {
    ctx.beginPath();

    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  }
}
