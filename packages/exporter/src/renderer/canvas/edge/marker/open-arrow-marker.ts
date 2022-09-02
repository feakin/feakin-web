import { MarkerShapeOption } from "../marker-shape-option";
import { Point } from "../../../../model/geometry/point";

export function openArrowMarker(canvas: CanvasRenderingContext2D, options: MarkerShapeOption) {
  const { pointEnd, size, strokeWidth, widthFactor } = options;
  let { unitX, unitY } = options
  const sw = strokeWidth;
  const pe = pointEnd;

  const endOffsetX = unitX * sw * 1.118;
  const endOffsetY = unitY * sw * 1.118;

  unitX *= size + sw;
  unitY *= size + sw;

  const pt: Point = { x: pointEnd.x, y: pointEnd.y };
  pt.x -= endOffsetX;
  pt.y -= endOffsetY;

  pe.x += -endOffsetX * 2;
  pe.y += -endOffsetY * 2;

  canvas.beginPath();
  canvas.moveTo(
    pt.x - unitX - unitY / widthFactor,
    pt.y - unitY + unitX / widthFactor
  );
  canvas.lineTo(pt.x, pt.y);
  canvas.lineTo(
    pt.x + unitY / widthFactor - unitX,
    pt.y - unitY - unitX / widthFactor
  );
  canvas.stroke();
}
