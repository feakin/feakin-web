import { Shape } from "./base/shape";
import { ShapeType } from "./base/shape-type";

export class EllipseShape extends Shape {
  override type = ShapeType.Ellipse;
  width: number;
  height: number;

  constructor(x = 0, y = 0, width = 0, height = 0) {
    super(x, y);
    this.width = width;
    this.height = height;
  }
}
