/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 * Updated to ES9 syntax by David Morrissey 2021
 * Type definitions from the typed-mxgraph project
 */
import { Point } from "../../model/geometry/point";
import { Arrowhead } from "../../model/edge/decorator/arrowhead";
import { EdgeProperty } from "../../model/graph";
import { defaultArrowSize } from "../../model/edge/decorator/edge-decorator";

export interface MarkerShapeOption {
  unitX: number;
  unitY: number;
  widthFactor: number;
  pointEnd: Point;
  strokeWidth: number;
  size: number;
  filled: boolean
}

// The angle of the forward facing arrow sides against the x axis is
// 26.565 degrees, 1/sin(26.565) = 2.236 / 2 = 1.118 ( / 2 allows for
// only half the strokewidth is processed ).
function createTriangleMarker(canvas: CanvasRenderingContext2D, options: MarkerShapeOption) {
  let { unitX, unitY } = options
  const { strokeWidth, widthFactor, pointEnd, size, filled } = options;

  const endOffsetX = unitX * strokeWidth * 1.118;
  const endOffsetY = unitY * strokeWidth * 1.118;

  unitX *= size + strokeWidth;
  unitY *= size + strokeWidth;

  const pt = {
    x: pointEnd.x - endOffsetX,
    y: pointEnd.y - endOffsetY
  };

  // const f = type !== ARROW.CLASSIC && type !== ARROW.CLASSIC_THIN ? 1 : 3 / 4;
  const f = 1;
  pointEnd.x += -unitX * f - endOffsetX;
  pointEnd.y += -unitY * f - endOffsetY;

  canvas.beginPath();
  canvas.moveTo(pt.x, pt.y);
  canvas.moveTo(
    pt.x - unitX - unitY / widthFactor,
    pt.y - unitY + unitX / widthFactor
  );
  canvas.lineTo(pt.x, pt.y);
  canvas.lineTo(
    pt.x + unitY / widthFactor - unitX,
    pt.y - unitY - unitX / widthFactor
  );

  canvas.closePath();

  if (filled) {
    canvas.fill();
  }

  canvas.stroke();
}

function createEllipseMarker(canvas: CanvasRenderingContext2D, options: MarkerShapeOption) {
  const { unitX, unitY, pointEnd, size, filled } = options;
  const radius = size;

  const pt: Point = { x: pointEnd.x, y: pointEnd.y };
  pointEnd.x -= unitX * radius;
  pointEnd.y -= unitY * radius;

  canvas.beginPath();
  canvas.ellipse(pt.x, pt.y, radius, radius, 0, 0, 2 * Math.PI);
  canvas.closePath();

  if (filled) {
    canvas.fill();
  }

  canvas.stroke();
}

function createDiamondMarker(canvas: CanvasRenderingContext2D, options: MarkerShapeOption) {
  let { unitX, unitY } = options
  const { pointEnd, size, filled, strokeWidth } = options;
  const sw = strokeWidth;

  // The angle of the forward facing arrow sides against the x axis is
  // 45 degrees, 1/sin(45) = 1.4142 / 2 = 0.7071 ( / 2 allows for
  // only half the strokewidth is processed ). Or 0.9862 for thin diamond.
  // Note these values and the tk variable below are dependent, update
  // both together (saves trig hard coding it).
  const swFactor = 0.7071;
  const endOffsetX = unitX * sw * swFactor;
  const endOffsetY = unitY * sw * swFactor;

  unitX *= size * 2 + sw;
  unitY *= size * 2+ sw;

  const pt: Point = { x: pointEnd.x, y: pointEnd.y };
  pt.x -= endOffsetX;
  pt.y -= endOffsetY;

  pointEnd.x += -unitX - endOffsetX;
  pointEnd.y += -unitY - endOffsetY;

  // thickness factor for diamond
  const tk = 2;

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

function createSquareMarker(canvas: CanvasRenderingContext2D, options: MarkerShapeOption) {
  const { unitX, unitY, pointEnd, size, filled } = options;
  const radius = size;

  const pt: Point = { x: pointEnd.x, y: pointEnd.y };
  pointEnd.x -= unitX * radius;
  pointEnd.y -= unitY * radius;

  canvas.beginPath();
  canvas.rect(pt.x - radius, pt.y - radius, radius * 2, radius * 2);

  if (filled) {
    canvas.fill();
  }

  canvas.stroke();
  canvas.closePath();
}

function createNotchedArrow(canvas: CanvasRenderingContext2D, options: MarkerShapeOption) {
  const { unitX, unitY, pointEnd, filled } = options;

  const pt: Point = { x: pointEnd.x, y: pointEnd.y };

  canvas.beginPath();
  canvas.moveTo(pt.x, pt.y);
  canvas.lineTo(pt.x - unitX - unitY / 2, pt.y - unitY + unitX / 2);
  canvas.lineTo(pt.x - unitX, pt.y - unitY);
  canvas.lineTo(pt.x - unitX - unitY / 2, pt.y - unitY - unitX / 2);
  canvas.closePath();

  if (filled) {
    canvas.fill();
  }

  canvas.stroke();
}

export function drawingFacingArrow(canvas: CanvasRenderingContext2D, arrowhead: Arrowhead, points: Point[], source: boolean, props: EdgeProperty) {
  const widthFactor = 2;
  const strokeWidth = props.stroke?.width || 2;
  const size = props.decorator?.arrowSize || defaultArrowSize;

  const length = points.length;
  let p0 = source ? points[1] : points[length - 2];
  const pointEnd = source ? points[0] : points[length - 1];

  let count = 1;

  // Uses next non-overlapping point
  while (count < length - 1 && Math.round(p0.x - pointEnd.x) === 0 && Math.round(p0.y - pointEnd.y) === 0) {
    p0 = source ? points[1 + count] : points[length - 2 - count];
    count++;
  }

  // Computes the norm and the inverse norm
  const dx = pointEnd.x - p0.x;
  const dy = pointEnd.y - p0.y;

  const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));

  const unitX = dx / dist;
  const unitY = dy / dist;


  const options: MarkerShapeOption = {
    unitX, strokeWidth, unitY, size, pointEnd, widthFactor, filled: arrowhead.includes("filled"),
  };

  switch (arrowhead) {
    case Arrowhead.NONE:
      break;
    case Arrowhead.NOTCHED:
      createNotchedArrow(canvas, options);
      break;
    case Arrowhead.FILLED:
    case Arrowhead.HOLLOW:
      createTriangleMarker(canvas, options);
      break;
    case Arrowhead.FILLED_CIRCLE:
    case Arrowhead.HOLLOW_CIRCLE:
      createEllipseMarker(canvas, options);
      break;
    case Arrowhead.HOLLOW_DIAMOND:
    case Arrowhead.FILLED_DIAMOND:
      createDiamondMarker(canvas, options);
      break;
    case Arrowhead.HOLLOW_SQUARE:
    case Arrowhead.FILLED_SQUARE:
      createSquareMarker(canvas, options);
      break;
    default:
      createTriangleMarker(canvas, options);
  }

}
