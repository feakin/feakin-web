/**
 * Line is a simple 2D line with start and end points.
 * Keep in mind that the line is not a shape, it is just a line.
 * But we keep it same with mxGraph API, in order to keep the same API with mxGraph.
 */
import { Point } from "../geometry/point";
import { Shape } from "../node/base/shape";

export class LineShape extends Shape {
  private _points: Point[];

  constructor(x: number, y: number, points: Point[]) {
    super(x, y);
    this._points = points;
  }

  override points(): Point[] {
    return this._points;
  }

  startPoint(): Point {
    return this._points[0];
  }

  endPoint(): Point {
    return this._points[this._points.length - 1];
  }
}
