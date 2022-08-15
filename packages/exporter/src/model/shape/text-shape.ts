import { Shape } from "./shape";
import { ShapeType } from "./shape-type";

export class TextShape extends Shape {
  private dx = 0;
  private dy = 0;
  private text = "";

  shape = ShapeType.Text;

  constructor(x = 0, y = 0, dx = 0, dy = 0, text = "") {
    super();
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.text = text;
  }
}
