import { Shape } from "./shape";
import { ShapeType } from "./shape-type";

export class CircleShape extends Shape {
  override type = ShapeType.Circle;

  constructor(x = 0, y = 0, radius = 0) {
    super(x, y);
    this.radius = radius;
  }
}
