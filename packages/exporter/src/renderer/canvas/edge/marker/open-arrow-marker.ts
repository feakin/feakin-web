import { MarkerShapeOption } from "../marker-shape-option";
import { Point } from "../../../../model/geometry/point";
import { CanvasMarker } from "./canvas-marker";

export class OpenArrowMarker extends CanvasMarker {
  constructor(context: CanvasRenderingContext2D, shapeOptions: MarkerShapeOption) {
    super(context, shapeOptions);
  }

  override draw() {
    const { pointEnd, size, strokeWidth, widthFactor } = this.options;
    let { unitX, unitY } = this.options
    const sw = strokeWidth;
    const pe = pointEnd;

    const endOffsetX = unitX * sw * 1.118;
    const endOffsetY = unitY * sw * 1.118;

    unitX *= size + sw;
    unitY *= size + sw;

    const pt: Point = { x: pointEnd.x, y: pointEnd.y };
    pt.x -= endOffsetX;
    pt.y -= endOffsetY;

    pe.x += -endOffsetX * 2;
    pe.y += -endOffsetY * 2;

    this.canvas.beginPath();
    this.canvas.moveTo(
      pt.x - unitX - unitY / widthFactor,
      pt.y - unitY + unitX / widthFactor
    );
    this.canvas.lineTo(pt.x, pt.y);
    this.canvas.lineTo(
      pt.x + unitY / widthFactor - unitX,
      pt.y - unitY - unitX / widthFactor
    );
    this.canvas.stroke();
  }
}
