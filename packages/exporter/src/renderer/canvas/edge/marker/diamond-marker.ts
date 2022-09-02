import { MarkerShapeOption } from "../marker-shape-option";
import { Point } from "../../../../model/geometry/point";

export function diamondMarker(canvas: CanvasRenderingContext2D, options: MarkerShapeOption) {
  let { unitX, unitY } = options
  const { pointEnd, size, filled, strokeWidth } = options;
  const sw = strokeWidth;

  // The angle of the forward facing arrow sides against the x axis is
  // 45 degrees, 1/sin(45) = 1.4142 / 2 = 0.7071 ( / 2 allows for
  // only half the strokewidth is processed ). Or 0.9862 for thin diamond.
  // Note these values and the tk variable below are dependent, update
  // both together (saves trig hard coding it).
  const swFactor = 0.9862;
  const endOffsetX = unitX * sw * swFactor;
  const endOffsetY = unitY * sw * swFactor;

  unitX *= size * 2 + sw;
  unitY *= size * 2 + sw;

  const pt: Point = { x: pointEnd.x, y: pointEnd.y };
  pt.x -= endOffsetX;
  pt.y -= endOffsetY;

  pointEnd.x += -unitX - endOffsetX;
  pointEnd.y += -unitY - endOffsetY;

  // thickness factor for diamond
  // const tk = type === ARROW.DIAMOND ? 2 : 3.4;
  const tk = 3.4;

  canvas.beginPath();
  canvas.moveTo(pt.x, pt.y);
  canvas.lineTo(pt.x - unitX / 2 - unitY / tk, pt.y + unitX / tk - unitY / 2);
  canvas.lineTo(pt.x - unitX, pt.y - unitY);
  canvas.lineTo(pt.x - unitX / 2 + unitY / tk, pt.y - unitY / 2 - unitX / tk);
  canvas.closePath();

  if (filled) {
    canvas.fill();
  }

  canvas.stroke();
}
