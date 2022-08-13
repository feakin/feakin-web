/**
 * Base class for all shapes.
 * A shape in feakin is a separate class that is used to draw a shape in SVG, Canvas.
 *
 * ## Custom Shapes
 * To extend from this class, the basic code looks as follows.
 *
 * ```javascript
 *
 * ```
 *
 */
import { Point } from "../geometry/point";

export class Shape {

  x: number;
  y: number;

  private _fontSize = 12;
  get fontSize(): number {
    return this._fontSize;
  }

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * @param scale The scale to be applied to the shape.
   */
  scale(scale: number) {
    //
  }

  /**
   * label to put in center
   */
  labelPosition() {
    //
  }

  points(): Point[] {
    return [];
  }

  rotate() {
    //
  }
}

