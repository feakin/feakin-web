import { Rectangle } from "../model/shapes/rectangle";
import { Point } from "../model/geometry/point";
import { ElementProperty } from "../model/graph";
import { Circle } from "../model/shapes/circle";
import { HexagonShape } from "../model/shapes/hexagon";
import { CloudShape } from "../model/shapes/cloud-shape";

export class SvgShapeDrawing {
  private ctx: SVGElement;
  private property: ElementProperty;
  private svg: Element;

  private defaultProperty: ElementProperty = {
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
    this.svg = this.createElement('svg');

    this.initSvgWrapper();
  }

  initSvgWrapper() {
    let element = this.createElement('svg');
    element.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    element.setAttribute('version', '1.1');
    element.setAttribute('width', '100%');
    element.setAttribute('height', '100%');

    return element;
  }

  createElement(tagName: string, namespace?: string): Element {
    return this.ctx.ownerDocument.createElementNS(
      namespace || '"http://www.w3.org/1999/xhtml"',
      tagName
    )
  }

  drawRect(rect: Rectangle): this {
    const rectEl = this.createElement('rect');
    rectEl.setAttribute('x', String(rect.x));
    rectEl.setAttribute('y', String(rect.y));
    rectEl.setAttribute('width', String(rect.width));
    rectEl.setAttribute('height', String(rect.height));

    this.ctx.appendChild(rectEl)
    return this;
  }

  pointsToSvgPath(points: Point[]): string {
    let path = 'M' + points[0].x + ',' + points[0].y;
    for (let i = 1; i < points.length; i++) {
      path += ' L' + points[i].x + ',' + points[i].y;
    }

    return path;
  }

  drawPath(points: Point[]): this {
    let path = this.pointsToSvgPath(points);

    const pathEl = this.createElement('path');
    pathEl.setAttribute('d', path);

    this.configProperty(pathEl);

    this.ctx.appendChild(pathEl)
    return this;
  }

  private configProperty(pathEl: Element) {
    let stroke = this.property.stroke;
    let fill = this.property.fill;

    if (stroke != null) {
      pathEl.setAttribute('stroke', stroke.strokeColor);
      pathEl.setAttribute('stroke-width', String(stroke.strokeWidth));
      pathEl.setAttribute('stroke-opacity', String(stroke.strokeOpacity));
    }

    if (fill != null) {
      pathEl.setAttribute('fill', fill.transparent ? 'transparent' : '#000000');
    }
  }

  drawCircle(circle: Circle): this {
    const circleEl = this.createElement('circle');
    circleEl.setAttribute('cx', String(circle.x));
    circleEl.setAttribute('cy', String(circle.y));
    circleEl.setAttribute('r', String(circle.radius));

    this.configProperty(circleEl);

    this.ctx.appendChild(circleEl)
    return this;
  }

  drawHexagon(hexagon: HexagonShape): this {
    const hexagonEl = this.createElement('polygon');
    hexagonEl.setAttribute('points', hexagon.points().map(p => p.x + ',' + p.y).join(' '));

    this.configProperty(hexagonEl);

    this.ctx.appendChild(hexagonEl)
    return this;
  }
}
