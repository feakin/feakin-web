import { Shape } from "./shape";

export class Circle extends Shape {
  radius: number;

  constructor(x: number = 0, y: number = 0, radius: number = 0) {
    super(x, y, radius, radius);
    this.radius = radius;
  }
}
