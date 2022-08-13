import { Shape } from "./shape";

export class Rectangle extends Shape {
  width: number;
  height: number;

  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

  override labelPosition() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    };
  }
}
