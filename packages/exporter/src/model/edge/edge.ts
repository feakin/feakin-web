import { Point } from "../geometry/point";

export interface Edge {
  paintEdgeShape(points: Point[]): any;
}
