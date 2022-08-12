import { Rectangle } from "../model/shapes/rectangle";
import { Point } from "../model/geometry/point";
import { ElementProperty } from "../model/graph";

export class SvgShapeDrawing {
  private ctx: SVGElement;
  private property: ElementProperty;

  private defaultProperty = {
    stroke: {
      strokeColor: '#000000',
      strokeWidth: 1,
      strokeOpacity: 1
    }
  };

  constructor(context: SVGElement, property?: ElementProperty) {
    this.ctx = context;
    this.property = property == null ? this.defaultProperty : property;
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

  pointsToSvgPath(points: { x: number; y: number; }[]): string {
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

    let stroke = this.property.stroke;

    if (stroke != null) {
      pathEl.setAttribute('stroke', stroke.strokeColor);
      pathEl.setAttribute('stroke-width', String(stroke.strokeWidth));
      pathEl.setAttribute('stroke-opacity', String(stroke.strokeOpacity));
    }

    this.ctx.appendChild(pathEl)
    return this;
  }
}
