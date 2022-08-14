import { Shape } from "./shape";

export class CircleShape extends Shape {
  radius: number;

  constructor(x = 0, y = 0, radius = 0) {
    super(x, y);
    this.radius = radius;
  }
}
