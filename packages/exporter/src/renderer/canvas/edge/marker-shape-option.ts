import { Point } from "../../../model/geometry/point";

export interface MarkerShapeOption {
  unitX: number;
  unitY: number;
  pointEnd: Point;
  filled: boolean
  size: number;
  widthFactor: number;
  strokeWidth: number;
}
