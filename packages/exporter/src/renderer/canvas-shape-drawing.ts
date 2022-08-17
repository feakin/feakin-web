import { Point } from "../model/geometry/point";
import { ElementProperty } from "../model/graph";
import { ShapeDrawing } from "./shape-drawing";
import { CircleShape, DiamondShape, HexagonShape, RectangleShape, TriangleShape } from "../model/shape";

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

    if (!rect.isRounded) {
      this._ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
      this._ctx.fill();
    } else {
      this.drawRoundedRect(rect);
    }

    return this
  }

  drawRoundedRect(rect: RectangleShape): this {
    const { x, y, width, height } = rect;
    const radius = rect.radius;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const cornerRadius = Math.min(radius, halfWidth, halfHeight);
    const cornerX = x + cornerRadius;
    const cornerY = y + cornerRadius;
    const cornerWidth = width - cornerRadius * 2;
    const cornerHeight = height - cornerRadius * 2;
    this._ctx.moveTo(cornerX, cornerY);
    this._ctx.arcTo(cornerX + cornerWidth, cornerY, cornerX + cornerWidth, cornerY + cornerHeight, cornerRadius);
    this._ctx.arcTo(cornerX + cornerWidth, cornerY + cornerHeight, cornerX, cornerY + cornerHeight, cornerRadius);
    this._ctx.arcTo(cornerX, cornerY + cornerHeight, cornerX, cornerY, cornerRadius);
    this._ctx.arcTo(cornerX, cornerY, cornerX + cornerWidth, cornerY, cornerRadius);
    this._ctx.stroke();

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

  drawTriangle(triangle: TriangleShape): this {
    this.drawPath(triangle.points(), {
      x: triangle.x,
      y: triangle.y
    });

    return this;
  }

  recursiveRender(): this {
    return this;
  }
}
