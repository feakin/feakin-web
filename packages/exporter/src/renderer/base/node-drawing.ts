import { ElementProperty } from "../../model/graph";
import { Point } from "../../model/geometry/point";
import { EllipseShape, HexagonShape, RectangleShape, DiamondShape, TriangleShape } from "../../model/node";

export interface NodeDrawing {
  property: ElementProperty;
  defaultProperty: ElementProperty;

  /**
   * Configure the property of the shape.
   * for SVG element is not need
   */
  configProperty(element?: Element): void;

  drawRect(rect: RectangleShape): this;

  drawPath(point: Point[], offset: Point): this;

  drawEllipse(ellipse: EllipseShape): this;

  drawHexagon(hexagon: HexagonShape): this;

  drawDiamond(diamond: DiamondShape): this;

  drawTriangle(triangle: TriangleShape): this;
}
