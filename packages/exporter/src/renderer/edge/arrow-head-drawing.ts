import { Arrowhead } from "../../model/edge/decorator/arrowhead";
import { Point } from "../../model/geometry/point";

export class ArrowHeadDrawing {
  static canvas(ctx: CanvasRenderingContext2D, arrowhead: Arrowhead, point: Point, size = 1): void {
    const { x, y } = point;

    switch (arrowhead) {
      case Arrowhead.NONE:
        return;
      case Arrowhead.NOTCHED:
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x, y + size);
        ctx.closePath();
        ctx.fill();
        break;
      case Arrowhead.HOLLOW:
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x, y + size);
        ctx.closePath();
        ctx.stroke();
        break;
      case Arrowhead.HOLLOW_CIRCLE:
        ctx.beginPath();
        ctx.arc(x + size, y + size, size, 0, 2 * Math.PI);
        ctx.fill();
        break;
      case Arrowhead.HOLLOW_SQUARE:
        ctx.beginPath();
        ctx.rect(x, y, size, size);
        ctx.fill();
        break;
      case Arrowhead.HOLLOW_DIAMOND:
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x, y + size);
        ctx.closePath();
        ctx.fill();
        break;
      case Arrowhead.FILLED:
        ctx.beginPath();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size / 2, y - size);
        ctx.closePath();
        ctx.fill();
        break;
      case Arrowhead.FILLED_CIRCLE:
        ctx.beginPath();
        ctx.arc(x + size, y + size, size, 0, 2 * Math.PI);
        ctx.fill();
        break;
      case Arrowhead.FILLED_SQUARE:
        ctx.beginPath();
        ctx.rect(x, y, size, size);
        ctx.fill();
        break;
      case Arrowhead.FILLED_DIAMOND:
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x, y + size);
        ctx.closePath();
        ctx.fill();
        break;
    }
  }
}
