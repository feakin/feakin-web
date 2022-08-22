import { ElementProperty } from "../model/graph";
import { Point } from "../model/geometry/point";
import { CircleShape, HexagonShape, RectangleShape, DiamondShape, TriangleShape } from "../model/node";

export interface ShapeDrawing {
  property: ElementProperty;
  defaultProperty: ElementProperty;

  /**
   * Configure the property of the shape.
   * for SVG element is not need
   */
  configProperty(element?: Element): void;

  drawRect(rect: RectangleShape): this;

  drawPath(point: Point[], offset: Point): this;

  drawCircle(circle: CircleShape): this;

  drawHexagon(hexagon: HexagonShape): this;

  drawDiamond(diamond: DiamondShape): this;

  drawTriangle(triangle: TriangleShape): this;
}
