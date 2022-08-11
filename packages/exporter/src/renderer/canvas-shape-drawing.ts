import { Rectangle } from "../model/shapes/rectangle";

export class CanvasShapeDrawing {
  ctx: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.ctx = context;
  }

  drawRect(rect: Rectangle): void {
    this.ctx.rect(rect.x, rect.y, rect.width, rect.height);
    this.ctx.fill();
  }

  drawByPath(path: Path2D): void {
    this.ctx.fill(path);
  }
}
