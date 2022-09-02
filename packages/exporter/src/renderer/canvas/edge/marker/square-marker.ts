import { MarkerShapeOption } from "../marker-shape-option";
import { Point } from "../../../../model/geometry/point";

export function squareMarker(canvas: CanvasRenderingContext2D, options: MarkerShapeOption) {
  const { unitX, unitY, pointEnd, size, filled } = options;
  const radius = size;

  const pt: Point = { x: pointEnd.x, y: pointEnd.y };
  pointEnd.x -= unitX * radius;
  pointEnd.y -= unitY * radius;

  canvas.beginPath();
  canvas.rect(pt.x - radius, pt.y - radius, radius * 2, radius * 2);

  if (filled) {
    canvas.fill();
  }

  canvas.stroke();
  canvas.closePath();
}
