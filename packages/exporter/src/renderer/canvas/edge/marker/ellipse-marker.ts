import { MarkerShapeOption } from "../marker-shape-option";
import { Point } from "../../../../model/geometry/point";
import { CanvasMarker } from "./canvas-marker";

export class EllipseMarker extends CanvasMarker {
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
    this.canvas.ellipse(pt.x, pt.y, radius, radius, 0, 0, 2 * Math.PI);
    this.canvas.closePath();

    if (filled) {
      this.canvas.fill();
    }

    this.canvas.stroke();
  }
}
