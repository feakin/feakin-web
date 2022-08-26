import { Shape, ShapeType } from "./base/shape";

export class PolygonShape extends Shape {
  override type = ShapeType.Polygon;
  width: number;
  height: number;

  constructor(x = 0, y = 0, width = 0, height = 0) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

  override labelPosition() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2 - this.fontSize / 2
    };
  }
}
