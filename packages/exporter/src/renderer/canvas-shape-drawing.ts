import { Rectangle } from "../model/shape/rectangle";
import { Point, Point_ } from "../model/geometry/point";
import { CircleShape } from "../model/shape/circle-shape";
import { HexagonShape } from "../model/shape/hexagon-shape";

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

  drawPath(point: Point[], offset: Point = { x: 0, y: 0 }): this {
    this.ctx.beginPath();
    this.ctx.moveTo(point[0].x + offset.x, point[0].y + offset.y);
    for (let i = 1; i < point.length; i++) {
      this.ctx.lineTo(point[i].x + offset.x, point[i].y + offset.y);
    }

    this.ctx.stroke();
    return this;
  }

  drawCircle(circle: CircleShape): this {
    this.ctx.beginPath();
    this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    return this;
  }

  drawHexagon(hexagon: HexagonShape) {
    this.drawPath(hexagon.points(), {
      x: hexagon.x,
      y: hexagon.y
    });
    return this;
  }
}
