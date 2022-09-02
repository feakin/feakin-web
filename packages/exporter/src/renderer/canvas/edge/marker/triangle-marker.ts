// The angle of the forward facing arrow sides against the x axis is
// 26.565 degrees, 1/sin(26.565) = 2.236 / 2 = 1.118 ( / 2 allows for
// only half the strokewidth is processed ).
import { MarkerShapeOption } from "../marker-shape-option";
import { CanvasMarker } from "./canvas-marker";

export class TriangleMarker extends CanvasMarker {
  constructor(canvas: CanvasRenderingContext2D, options: MarkerShapeOption) {
    super(canvas, options);
  }

  override draw() {
    let { unitX, unitY } = this.options
    const { strokeWidth, widthFactor, pointEnd, size, filled } = this.options;

    const endOffsetX = unitX * strokeWidth * 1.118;
    const endOffsetY = unitY * strokeWidth * 1.118;

    unitX *= size + strokeWidth;
    unitY *= size + strokeWidth;

    const pt = {
      x: pointEnd.x - endOffsetX,
      y: pointEnd.y - endOffsetY
    };

    // const f = type !== ARROW.CLASSIC && type !== ARROW.CLASSIC_THIN ? 1 : 3 / 4;
    const f = 1;
    pointEnd.x += -unitX * f - endOffsetX;
    pointEnd.y += -unitY * f - endOffsetY;

    this.canvas.beginPath();
    this.canvas.moveTo(pt.x, pt.y);
    this.canvas.moveTo(
      pt.x - unitX - unitY / widthFactor,
      pt.y - unitY + unitX / widthFactor
    );
    this.canvas.lineTo(pt.x, pt.y);
    this.canvas.lineTo(
      pt.x + unitY / widthFactor - unitX,
      pt.y - unitY - unitX / widthFactor
    );

    this.canvas.closePath();

    if (filled) {
      this.canvas.fill();
    }

    this.canvas.stroke();
  }
}
