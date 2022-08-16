import { Point } from "./point";
import { StrokeState } from "../state-style/stroke-state";

/**
 * Line is a simple 2D line with start and end points.
 */
export interface Line extends Point {
  stroke?: StrokeState,
}
