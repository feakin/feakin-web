import { Shape } from "./shape";
import { ShapeType } from "./shape-type";

export class CloudShape extends Shape {
  width: number;
  height: number;

  override type = ShapeType.Cloud;

  constructor(x = 0, y = 0, width = 0, height = 0) {
    super(x, y);
    this.width = width;
    this.height = height;
  }
}
