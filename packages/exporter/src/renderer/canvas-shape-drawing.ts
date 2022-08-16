import { Point } from "../model/geometry/point";
import { ElementProperty } from "../model/graph";
import { ShapeDrawing } from "./shape-drawing";
import { CircleShape, DiamondShape, HexagonShape, RectangleShape } from "../model/shape";

export class CanvasShapeDrawing implements ShapeDrawing {
  private readonly _ctx: CanvasRenderingContext2D;
  get ctx(): CanvasRenderingContext2D {
    return this._ctx;
  }

  property: ElementProperty;

  defaultProperty: ElementProperty = {
    fill: {
      transparent: true,
    },
    stroke: {
      strokeColor: '#000000',
      strokeWidth: 1,
      strokeOpacity: 1
    }
  };

  constructor(context: CanvasRenderingContext2D, property?: ElementProperty) {
    this._ctx = context;
    this.property = property == null ? this.defaultProperty : property;
  }

  configProperty() {
    if (this.property.fill?.transparent) {
      this._ctx.fillStyle = 'transparent';
    }

    if (this.property.stroke != null) {
      this._ctx.strokeStyle = this.property.stroke?.strokeColor || '#000000';
    }
  }

  drawRect(rect: RectangleShape): this {
    this.configProperty();

    this._ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    this._ctx.fill();
    return this
  }

  drawPath(point: Point[], offset: Point = { x: 0, y: 0 }): this {
    this._ctx.beginPath();
    this._ctx.moveTo(point[0].x + offset.x, point[0].y + offset.y);
    for (let i = 1; i < point.length; i++) {
      this._ctx.lineTo(point[i].x + offset.x, point[i].y + offset.y);
    }

    this._ctx.stroke();
    return this;
  }

  drawCircle(circle: CircleShape): this {
    this._ctx.beginPath();
    this._ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    this._ctx.stroke();
    return this;
  }

  drawHexagon(hexagon: HexagonShape): this {
    this.drawPath(hexagon.points(), {
      x: hexagon.x,
      y: hexagon.y
    });
    return this;
  }

  drawDiamond(diamond: DiamondShape): this {
    this.drawPath(diamond.points(), {
      x: diamond.x,
      y: diamond.y
    });

    return this;
  }

  recursiveRender(): this {
    return this;
  }
}
