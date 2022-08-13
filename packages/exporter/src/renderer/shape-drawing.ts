import { ElementProperty } from "../model/graph";
import { Rectangle } from "../model/shape/rectangle";
import { Point } from "../model/geometry/point";
import { CircleShape } from "../model/shape/circle-shape";
import { HexagonShape } from "../model/shape/hexagon-shape";

export interface ShapeDrawing {
  property: ElementProperty;
  defaultProperty: ElementProperty;

  /**
   * Configure the property of the shape.
   * for SVG element is not need
   */
  configProperty(element?: Element): void;

  drawRect(rect: Rectangle): this;

  drawPath(point: Point[], offset: Point): this;

  drawCircle(circle: CircleShape): this;

  drawHexagon(hexagon: HexagonShape): this;
}
