import { Shape } from "./shape";

export class Rectangle extends Shape {
  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(x, y, width, height);
  }
}
