import { MarkerShapeOption } from "../marker-shape-option";
import { Point } from "../../../../model/geometry/point";
import { CanvasMarker } from "./canvas-marker";

export class SquareMarker extends CanvasMarker {
  constructor(canvas: CanvasRenderingContext2D, option: MarkerShapeOption) {
    super(canvas, option);
  }

  override draw() {
    const { unitX, unitY, pointEnd, size, filled } = this.options;
    const radius = size;

    const pt: Point = { x: pointEnd.x, y: pointEnd.y };
    pointEnd.x -= unitX * radius;
    pointEnd.y -= unitY * radius;

    this.canvas.beginPath();
    this.canvas.rect(pt.x - radius, pt.y - radius, radius * 2, radius * 2);

    if (filled) {
      this.canvas.fill();
    }

    this.canvas.stroke();
    this.canvas.closePath();
  }
}
