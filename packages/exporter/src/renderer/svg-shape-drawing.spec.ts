import { SvgShapeDrawing } from "./svg-shape-drawing";
import { CircleShape, HexagonShape, RectangleShape, DiamondShape, TriangleShape, ImageShape } from "../model/node";

describe('SvgShapeDrawing', () => {
  let svg: SVGElement;

  beforeEach(function () {
    svg = document.createElement('svg') as unknown as SVGElement;
  });

  it('initWrapper', () => {
    const drawing = new SvgShapeDrawing(svg);
    const element = drawing.svg;

    expect(element.tagName).toBe('svg');
    expect(element.innerHTML).toBe('');
  });

  it('rect', () => {
    const drawing = new SvgShapeDrawing(svg as SVGElement);
    drawing.drawRect(new RectangleShape(0, 0, 100, 100));

    expect(svg.innerHTML).toBe('<rect x="0" y="0" width="100" height="100"></rect>');
  });

  it('rounded rect', () => {
    const drawing = new SvgShapeDrawing(svg as SVGElement);
    const rect = new RectangleShape(0, 0, 100, 100);
    rect.isRounded = true;
    drawing.drawRect(rect);

    expect(svg.innerHTML).toBe('<rect x="0" y="0" width="100" height="100" rx="2" ry="2"></rect>');
  });

  it('circle', () => {
    const drawing = new SvgShapeDrawing(svg as SVGElement);
    drawing.drawCircle(new CircleShape(0, 0, 100));

    expect(svg.innerHTML).toBe('<circle cx="0" cy="0" r="100" stroke="#000000" stroke-width="1" stroke-opacity="1" fill="transparent"></circle>');
  });

  it('path', () => {
    const drawing = new SvgShapeDrawing(svg as SVGElement);
    drawing.drawPath([{ x: 0, y: 0 }, { x: 50, y: 50 }, { x: 50, y: 100 }, { x: -50, y: 100 }]);

    expect(svg.innerHTML).toBe('<path d="M0,0 L50,50 L50,100 L-50,100" stroke="#000000" stroke-width="1" stroke-opacity="1" fill="transparent"></path>');
  });

  it('hexagon', () => {
    const drawing = new SvgShapeDrawing(svg as SVGElement);
    drawing.drawHexagon(new HexagonShape(0, 0, 100, 100));

    expect(svg.innerHTML).toBe('<polygon points="25,0 75,0 100,50 75,100 25,100 0,50 25,0" transform="translate(0,0)" stroke="#000000" stroke-width="1" stroke-opacity="1" fill="transparent"></polygon>');
  })

  it('diamond', () => {
    const drawing = new SvgShapeDrawing(svg as SVGElement);
    drawing.drawDiamond(new DiamondShape(0, 0, 100, 200));

    expect(svg.innerHTML).toBe('<polygon points="50,0 100,100 50,200 0,100 50,0" transform="translate(0,0)" stroke="#000000" stroke-width="1" stroke-opacity="1" fill="transparent"></polygon>');
  });

  it('triangle', () => {
    const drawing = new SvgShapeDrawing(svg as SVGElement);
    drawing.drawTriangle(new TriangleShape(0, 0, 100, 100));

    expect(svg.innerHTML).toBe('<polygon points="0,0 100,50 0,100 0,0" transform="translate(0,0)" stroke="#000000" stroke-width="1" stroke-opacity="1" fill="transparent"></polygon>');
  });

  it('image', () => {
    const drawing = new SvgShapeDrawing(svg as SVGElement);
    drawing.drawImage(new ImageShape(0, 0, 100, 100, 'image.png'));

    expect(svg.innerHTML).toBe('<image x="0" y="0" width="100" height="100" href="image.png"></image>');
  });

  it('curved line', () => {
    const drawing = new SvgShapeDrawing(svg as SVGElement);
    // start point - control points - end point
    drawing.drawCurvedLine([{ x: 220, y: 180 }, { x: 410, y: 210 }, { x: 410, y: 330 }, { x: 220, y: 300 }]);

    expect(svg.innerHTML).toBe('<path d="M220,180 C410,210 410,330 220,300" stroke="#000000" stroke-width="1" stroke-opacity="1" fill="transparent"></path>');
  });
});
