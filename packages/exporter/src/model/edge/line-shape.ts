/**
 * Line is a simple 2D line with start and end points.
 * Keep in mind that the line is not a shape, it is just a line.
 * But we keep it same with mxGraph API, in order to keep the same API with mxGraph.
 */
import { Shape } from "../node/base/shape";

export class LineShape extends Shape {
  private readonly width: number;
  private readonly height: number;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y);
    this.width = width;
    this.height = height;
  }
}
