import { Shape } from "./shape";

export class CloudShape extends Shape {
  width: number;
  height: number;

  constructor(x = 0, y = 0, width = 0, height = 0) {
    super(x, y);
    this.width = width;
    this.height = height;
  }
}
