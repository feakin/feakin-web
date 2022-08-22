import { Point } from "../model/geometry/point";
import { ElementProperty } from "../model/graph";
import { ShapeDrawing } from "./shape-drawing";
import { CircleShape, HexagonShape, ImageShape, RectangleShape, TriangleShape } from "../model/node";
import { DiamondShape } from "../model/node/diamond-shape";

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

  private generatePathString(points: Point[]): string {
    let path = 'M' + points[0].x + ',' + points[0].y;
    for (let i = 1; i < points.length; i++) {
      path += ' L' + points[i].x + ',' + points[i].y;
    }

    return path;
  }

  drawPath(points: Point[]): this {
    const path = this.generatePathString(points);

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

  drawCurvedLine(points: Point[]): this {
    if (points.length < 2) {
      throw new Error("points must have at least 2 points");
    }

    const length = points.length;

    const start = points[0];
    const end = points[length - 1];
    const controlPoints: Point[] = [];

    for (let i = 1; i < length - 1; i += 1) {
      const point = points[i];
      controlPoints.push(point);
    }

    console.log(controlPoints);

    const pathEl = this.createElement('path');
    // create bezier curve
    const path = 'M' + start.x + ',' + start.y + ' C' + controlPoints.map(p => p.x + ',' + p.y).join(' ') + ' ' + end.x + ',' + end.y;
    pathEl.setAttribute('d', path);
    this.configProperty(pathEl);
    this.ctx.appendChild(pathEl);

    return this;
  }

  private createBezierLine(start: Point, controlPoints: Point[], end: Point): string {
    let path = 'M' + start.x + ',' + start.y;
    for (let i = 0; i < controlPoints.length; i++) {
      const point = controlPoints[i];
      path += ' C' + point.x + ',' + point.y;
    }
    path += ' ' + end.x + ',' + end.y;
    return path;
  }

  recursiveRender(): this {
    return this;
  }
}
