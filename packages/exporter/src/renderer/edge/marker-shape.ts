/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 * Updated to ES9 syntax by David Morrissey 2021
 * Type definitions from the typed-mxgraph project
 */
import { Point } from "../../model/geometry/point";

function createTriangleArrow(unitX: number, strokeWidth: number, unitY: number, size: number, pe: Point, canvas: CanvasRenderingContext2D, widthFactor: number) {
  // The angle of the forward facing arrow sides against the x axis is
  // 26.565 degrees, 1/sin(26.565) = 2.236 / 2 = 1.118 ( / 2 allows for
  // only half the strokewidth is processed ).
  const endOffsetX = unitX * strokeWidth * 1.118;
  const endOffsetY = unitY * strokeWidth * 1.118;

  unitX *= size + strokeWidth;
  unitY *= size + strokeWidth;

  const pt = {
    x: pe.x - endOffsetX,
    y: pe.y - endOffsetY
  };

  // const f = type !== ARROW.CLASSIC && type !== ARROW.CLASSIC_THIN ? 1 : 3 / 4;
  const f = 1;
  pe.x += -unitX * f - endOffsetX;
  pe.y += -unitY * f - endOffsetY;

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
  canvas.fill();
  canvas.stroke();
}


export function drawingFacingArrow(canvas: CanvasRenderingContext2D, points: Point[], source: boolean) {
  const widthFactor = 2;
  const strokeWidth = 2;
  const size = 4;

  const length = points.length;
  let p0 = source ? points[1] : points[length - 2];
  const pe = source ? points[0] : points[length - 1];

  let count = 1;

  // Uses next non-overlapping point
  while (
    count < length - 1 &&
    Math.round(p0.x - pe.x) === 0 &&
    Math.round(p0.y - pe.y) === 0
    ) {
    p0 = source ? points[1 + count] : points[length - 2 - count];
    count++;
  }

  // Computes the norm and the inverse norm
  const dx = pe.x - p0.x;
  const dy = pe.y - p0.y;

  const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));

  const unitX = dx / dist;
  const unitY = dy / dist;

  createTriangleArrow(unitX, strokeWidth, unitY, size, pe, canvas, widthFactor);
}
