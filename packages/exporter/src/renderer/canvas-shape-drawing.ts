import { Rectangle } from "../model/shapes/rectangle";
import { Point } from "../model/geometry/point";

export class CanvasShapeDrawing {
  ctx: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.ctx = context;
  }

  drawRect(rect: Rectangle): this {
    this.ctx.rect(rect.x, rect.y, rect.width, rect.height);
    this.ctx.fill();
    return this
  }

  drawPath(point: Point[]): this {
    this.ctx.beginPath();
    this.ctx.moveTo(point[0].x, point[0].y);
    for (let i = 1; i < point.length; i++) {
      this.ctx.lineTo(point[i].x, point[i].y);
    }
    this.ctx.stroke();
    return this;
  }
}
