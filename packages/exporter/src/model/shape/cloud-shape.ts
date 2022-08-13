import { Shape } from "./shape";

export class CloudShape extends Shape {
  width: number;
  height: number;

  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(x, y);
    this.width = width;
    this.height = height;
  }
}
