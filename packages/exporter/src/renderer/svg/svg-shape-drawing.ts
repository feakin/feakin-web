import { Point } from "../../model/geometry/point";
import { defaultEdgeProperty, ElementProperty } from "../../model/graph";
import { NodeDrawing } from "../base/node-drawing";
import { CircleShape, HexagonShape, ImageShape, RectangleShape, TriangleShape } from "../../model/node";
import { DiamondShape } from "../../model/node/diamond-shape";
import { AbstractSvgRender } from "./abstract-svg-render";

export class SvgShapeDrawing implements NodeDrawing {
  private ctx: SVGElement;
  private readonly _svg: Element;
  private render: AbstractSvgRender;

  get svg(): Element {
    return this._svg;
  }

  property: ElementProperty;
  defaultProperty: ElementProperty = defaultEdgeProperty;

  constructor(context: SVGElement, property?: ElementProperty) {
    this.ctx = context;
    this.property = property == null ? this.defaultProperty : property;
    this._svg = this.initSvgWrapper();

    this.render = new AbstractSvgRender();
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
      pathEl.setAttribute('stroke', stroke.color ?? '#000000');
      pathEl.setAttribute('stroke-width', String(stroke.width));
      pathEl.setAttribute('stroke-opacity', String(stroke.opacity));
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
    let path = this.render.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      path += this.render.lineTo(points[i].x, points[i].y);
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
    this.drawByPoints(hexagon.points(), { x: hexagon.x, y: hexagon.y });
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

    const pathEl = this.createElement('path');
    pathEl.setAttribute('d', this.createQuadraticCurve(points));

    this.configProperty(pathEl);
    this.ctx.appendChild(pathEl);

    return this;
  }

  // inspired by maxGraph for align algorithm
  private createQuadraticCurve(points: Point[]): string {
    const length = points.length;
    let path = this.render.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < length - 2; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const ix = (p0.x + p1.x) / 2;
      const iy = (p0.y + p1.y) / 2;

      path += this.render.quadTo(p0.x, p0.y, ix, iy);
    }

    const p0 = points[length - 2];
    const p1 = points[length - 1];

    path += this.render.quadTo(p0.x, p0.y, p1.x, p1.y);

    return path;
  }
}
