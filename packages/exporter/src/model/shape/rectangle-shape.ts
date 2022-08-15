import { Shape } from "./shape";
import { ShapeType } from "./shape-type";

export class RectangleShape extends Shape {
  width: number;
  height: number;

  shape = ShapeType.Rectangle;

  constructor(x = 0, y = 0, width = 0, height = 0) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

  /**
   * calculate label position in center of rectangle.
   */
  override labelPosition() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2 - this.fontSize / 2
    };
  }
}
