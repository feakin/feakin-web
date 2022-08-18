import { Point } from "../model/geometry/point";
import { ElementProperty } from "../model/graph";
import { ShapeDrawing } from "./shape-drawing";
import { CircleShape, HexagonShape, ImageShape, RectangleShape, TriangleShape } from "../model/shape";
import { DiamondShape } from "../model/shape/diamond-shape";

export class SvgShapeDrawing implements ShapeDrawing {
  private ctx: SVGElement;
  private readonly _svg: Element;
  get svg(): Element {
    return this._svg;
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

  constructor(context: SVGElement, property?: ElementProperty) {
    this.ctx = context;
    this.property = property == null ? this.defaultProperty : property;
    this._svg = this.initSvgWrapper();
  }

  private initSvgWrapper() {
    const element = this.createElement('svg');
    element.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    element.setAttribute('version', '1.1');
    element.setAttribute('width', '100%');
    element.setAttribute('height', '100%');

    return element;
  }

  private createElement(tagName: string, namespace?: string): Element {
    return this.ctx.ownerDocument.createElementNS(
      namespace || '"http://www.w3.org/1999/xhtml"',
      tagName
    )
  }

  configProperty = (pathEl: Element) => {
    const stroke = this.property.stroke;
    const fill = this.property.fill;

    if (stroke != null) {
      pathEl.setAttribute('stroke', stroke.strokeColor);
      pathEl.setAttribute('stroke-width', String(stroke.strokeWidth));
      pathEl.setAttribute('stroke-opacity', String(stroke.strokeOpacity));
    }

    if (fill != null) {
      pathEl.setAttribute('fill', fill.transparent ? 'transparent' : '#000000');
    }
  };

  drawRect(rect: RectangleShape): this {
    const rectEl = this.createElement('rect');
    rectEl.setAttribute('x', String(rect.x));
    rectEl.setAttribute('y', String(rect.y));
    rectEl.setAttribute('width', String(rect.width));
    rectEl.setAttribute('height', String(rect.height));

    if (rect.isRounded) {
      rectEl.setAttribute('rx', String(rect.radius));
      rectEl.setAttribute('ry', String(rect.radius));
    }

    this.ctx.appendChild(rectEl)
    return this;
  }

  private pointsToSvgPath(points: Point[]): string {
    let path = 'M' + points[0].x + ',' + points[0].y;
    for (let i = 1; i < points.length; i++) {
      path += ' L' + points[i].x + ',' + points[i].y;
    }

    return path;
  }

  drawPath(points: Point[]): this {
    const path = this.pointsToSvgPath(points);

    const pathEl = this.createElement('path');
    pathEl.setAttribute('d', path);

    this.configProperty(pathEl);

    this.ctx.appendChild(pathEl)
    return this;
  }

  drawCircle(circle: CircleShape): this {
    const circleEl = this.createElement('circle');
    circleEl.setAttribute('cx', String(circle.x));
    circleEl.setAttribute('cy', String(circle.y));
    circleEl.setAttribute('r', String(circle.radius));

    this.configProperty(circleEl);

    this.ctx.appendChild(circleEl)
    return this;
  }

  private drawByPoints(points: Point[], location: Point) {
    const element = this.createElement('polygon');
    element.setAttribute('points', points.map(p => p.x + ',' + p.y).join(' '));
    // or set by location ?
    element.setAttribute('transform', 'translate(' + location.x + ',' + location.y + ')');

    this.configProperty(element);

    this.ctx.appendChild(element)
  }

  drawHexagon(hexagon: HexagonShape): this {
    this.drawByPoints(hexagon.points(), { x: hexagon.x, y: hexagon.y});
    return this;
  }

  drawDiamond(diamond: DiamondShape): this {
    this.drawByPoints(diamond.points(), { x: diamond.x, y: diamond.y });
    return this;
  }

  drawTriangle(triangle: TriangleShape): this {
    this.drawByPoints(triangle.points(), { x: triangle.x, y: triangle.y });
    return this;
  }

  drawImage(imageShape: ImageShape): this {
    const imageEl = this.createElement('image');
    imageEl.setAttribute('x', String(imageShape.x));
    imageEl.setAttribute('y', String(imageShape.y));
    imageEl.setAttribute('width', String(imageShape.width));
    imageEl.setAttribute('height', String(imageShape.height));
    imageEl.setAttribute('href', imageShape.imageSrc);
    this.ctx.appendChild(imageEl);
    return this;
  }

  recursiveRender(): this {
    return this;
  }
}
