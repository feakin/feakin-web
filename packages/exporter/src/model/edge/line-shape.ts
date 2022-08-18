import { Point } from "../geometry/point";
import { StrokeState } from "../state-style/stroke-state";

/**
 * Line is a simple 2D line with start and end points.
 */
export class LineShape implements Point {
  x!: number;
  y!: number;
  stroke?: StrokeState;
}
