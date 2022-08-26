import { Point } from "../../geometry/point";

export interface ShapeResource {
  type: ShapeResourceType;
  src: string;
}

export enum ShapeResourceType {
  None,
  Image = "image",
}

/**
 * Graphviz shape type: https://graphviz.org/doc/info/shapes.html
 */
export enum ShapeType {
  None,
  Circle = "circle",
  Line = "line",
  Rectangle = "rectangle",
  Hexagon = "hexagon",
  Triangle = "triangle",
  Cloud = "cloud",
  Cylinder = "cylinder",
  Text = "text",
  Polygon = "polygon",
  Diamond = "diamond",
  Image = "image",
  Arrow = "arrow",
  Custom = "custom",
}


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
export class Shape {
  x: number;
  y: number;
  type: ShapeType = ShapeType.None;
  private _isRounded = false;
  get isRounded(): boolean {
    return this._isRounded;
  }
  set isRounded(value: boolean) {
    this._isRounded = value;
  }

  hasResource = false;

  // rounded radius
  radius = 2;

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

  /**
   * todo: add close options
   */
  points(): Point[] {
    return [];
  }

  /**
   * shape resource
   */
  resource() : ShapeResource {
    return {
      type: ShapeResourceType.None,
      src: ""
    }
  }

  rotate() {
    //
  }
}
