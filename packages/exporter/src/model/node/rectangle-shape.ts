import { PolygonShape } from "./polygon-shape";
import { ShapeType } from "./base/shape-type";

export class RectangleShape extends PolygonShape {
  override type = ShapeType.Rectangle;

  constructor(x = 0, y = 0, width = 0, height = 0) {
    super(x, y, width, height);
  }

  /**
   * calculate label position in center of rectangle.
   */
  override center() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2 - this.fontSize / 2
    };
  }
}
