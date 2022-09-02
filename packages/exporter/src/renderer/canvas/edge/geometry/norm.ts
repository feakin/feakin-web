import { Point } from "../../../../model/geometry/point";

export function computeNorm(pointEnd: Point, p0: Point) {
  // Computes the norm and the inverse norm
  const dx = pointEnd.x - p0.x;
  const dy = pointEnd.y - p0.y;

  const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));

  const unitX = dx / dist;
  const unitY = dy / dist;
  return { unitX, unitY };
}
