/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 * Updated to ES9 syntax by David Morrissey 2021
 * Type definitions from the typed-mxgraph project
 */
import { Point } from "../../../model/geometry/point";
import { Arrowhead } from "../../../model/edge/decorator/arrowhead";
import { EdgeProperty } from "../../../model/graph";
import { defaultArrowSize } from "../../../model/edge/decorator/edge-decorator";
import { computeNorm } from "./geometry/norm";
import { triangleMarker } from "./marker/triangle-marker";
import { ellipseMarker } from "./marker/ellipse-marker";
import { DiamondMarker } from "./marker/diamond-marker";
import { squareMarker } from "./marker/square-marker";
import { openArrowMarker } from "./marker/open-arrow-marker";

export function computePointStart(points: Point[], pointEnd: Point, source: boolean) {
  const length = points.length;
  let p0 = source ? points[1] : points[length - 2];

  let count = 1;

  // Uses next non-overlapping point
  while (count < length - 1 && Math.round(p0.x - pointEnd.x) === 0 && Math.round(p0.y - pointEnd.y) === 0) {
    p0 = source ? points[1 + count] : points[length - 2 - count];
    count++;
  }

  return p0;
}

export function prepareOptions(props: EdgeProperty, points: Point[], source: boolean, arrowhead: Arrowhead) {
  const widthFactor = 2;
  const strokeWidth = props.stroke?.width || 2;
  const size = props.decorator?.arrowSize || defaultArrowSize;

  const length = points.length;
  const pointEnd = source ? points[0] : points[length - 1];
  const pointStart = computePointStart(points, pointEnd, source);
  const { unitX, unitY } = computeNorm(pointEnd, pointStart);

  return {
    unitX, strokeWidth, unitY, size, pointEnd, widthFactor, filled: arrowhead.includes("filled"),
  };
}

export function renderMarker(canvas: CanvasRenderingContext2D, arrowhead: Arrowhead, points: Point[], source: boolean, props: EdgeProperty) {
  const options = prepareOptions(props, points, source, arrowhead);

  switch (arrowhead) {
    case Arrowhead.NONE:
      break;
    case Arrowhead.NOTCHED:
      openArrowMarker(canvas, options);
      break;
    case Arrowhead.FILLED:
    case Arrowhead.HOLLOW:
      triangleMarker(canvas, options);
      break;
    case Arrowhead.FILLED_CIRCLE:
    case Arrowhead.HOLLOW_CIRCLE:
      ellipseMarker(canvas, options);
      break;
    case Arrowhead.HOLLOW_DIAMOND:
    case Arrowhead.FILLED_DIAMOND:
      new DiamondMarker(canvas, options).draw();
      break;
    case Arrowhead.HOLLOW_SQUARE:
    case Arrowhead.FILLED_SQUARE:
      squareMarker(canvas, options);
      break;
    default:
      triangleMarker(canvas, options);
  }
}
