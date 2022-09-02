import { MarkerShapeOption } from "../marker-shape-option";
import { Point } from "../../../../model/geometry/point";

export function ellipseMarker(canvas: CanvasRenderingContext2D, options: MarkerShapeOption) {
  const { unitX, unitY, pointEnd, size, filled } = options;
  const radius = size;

  const pt: Point = { x: pointEnd.x, y: pointEnd.y };
  pointEnd.x -= unitX * radius;
  pointEnd.y -= unitY * radius;

  canvas.beginPath();
  canvas.ellipse(pt.x, pt.y, radius, radius, 0, 0, 2 * Math.PI);
  canvas.closePath();

  if (filled) {
    canvas.fill();
  }

  canvas.stroke();
}
