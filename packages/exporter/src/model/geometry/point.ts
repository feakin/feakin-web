/**
 * Point is a simple 2D point with x and y coordinates.
 */
export interface Point {
  x: number;
  y: number;
}

export const flattenPoints = (points: Point[]): number[] => {
  const flatten: number[] = [];
  points.forEach(({ x, y }) => flatten.push(x, y));
  return flatten;
};

export const groupPoints = (points: Point[]): number[][] => {
  const flatten: number[][] = [];
  points.forEach(({ x, y }) => flatten.push([x, y]));
  return flatten;
};
