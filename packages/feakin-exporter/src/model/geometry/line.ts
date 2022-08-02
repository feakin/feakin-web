import { Point } from "./point";

export interface Shape {
  points: Point[],
}

export interface Line extends Point {
  stroke?: string,
}
