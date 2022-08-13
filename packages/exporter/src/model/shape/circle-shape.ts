import { Shape } from "./shape";

export class CircleShape extends Shape {
  radius: number;

  constructor(x: number = 0, y: number = 0, radius: number = 0) {
    super(x, y);
    this.radius = radius;
  }
}
