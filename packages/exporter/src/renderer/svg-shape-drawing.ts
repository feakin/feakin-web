import { Rectangle } from "../model/shapes/rectangle";

type SvgInHtml = HTMLElement & SVGElement;

export class SvgShapeDrawing {
  private ctx: SVGElement;

  constructor(context: SVGElement) {
    this.ctx = context;
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
}
