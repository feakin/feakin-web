/**
 * Point is a simple 2D point with x and y coordinates.
 */
export interface Point {
  x: number;
  y: number;
}

export class Point_ implements Point {
  constructor(public x: number = 0, public y: number = 0) {
    this.x = x;
    this.y = y;
  }
}
