import { Shape } from "./base/shape";
import { ShapeType } from "./base/shape-type";
import { Point } from "../geometry/point";

export class PolygonShape extends Shape {
  override type = ShapeType.Polygon;
  width: number;
  height: number;
  _points: Point[];
  _labelPosition: Point | undefined;

  constructor(x = 0, y = 0, width = 0, height = 0, points?: Point[], labelPosition?: Point) {
    super(x, y);
    this.width = width;
    this.height = height;
    this._points = points ?? [];
    this._labelPosition = labelPosition;
  }

  override points(): Point[] {
    return this._points;
  }

  override labelPosition() {
    if (this._labelPosition != null) {
      return this._labelPosition;
    }
    return this.center();
  }

  override center(): Point {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2 - this.fontSize / 2
    };
  }
}
