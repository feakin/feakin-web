import { Point } from "../geometry/point";

export interface EdgeShape {
  paintEdgeShape(points: Point[]): any;
}
