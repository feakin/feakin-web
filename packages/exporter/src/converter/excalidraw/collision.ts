/**
 * MIT License
 *
 * Copyright (c) 2020 Excalidraw
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

// The focus distance is the oriented ratio between the size of
// the `element` and the "focus image" of the element on which
// all focus points lie, so it's a number between -1 and 1.
// The line going through `a` and `b` is a tangent to the "focus image"
// of the element.
import {
  ExcalidrawBindableElement,
  ExcalidrawDiamondElement,
  ExcalidrawElement,
  ExcalidrawEllipseElement,
  ExcalidrawImageElement,
  ExcalidrawLinearElement,
  ExcalidrawRectangleElement,
  ExcalidrawTextElement,
  ExPoint,
  NonDeleted
} from "./excalidraw-types";

import * as GA from "./ga/ga";
import * as GAPoint from "./ga/gapoints";
import * as GADirection from "./ga/gadirections";
import * as GALine from "./ga/galines";
import * as GATransform from "./ga/gatransforms";
import { getElementAbsoluteCoords } from "./bounds";
import { rotate } from "./math";

export const calculateFocusAndGap = (
  linearElement: NonDeleted<ExcalidrawLinearElement>,
  hoveredElement: ExcalidrawBindableElement,
  startOrEnd: "start" | "end",
): { focus: number; gap: number } => {
  const direction = startOrEnd === "start" ? -1 : 1;
  const edgePointIndex = direction === -1 ? 0 : linearElement.points.length - 1;
  const adjacentPointIndex = edgePointIndex - direction;
  const edgePoint = getPointAtIndexGlobalCoordinates(
    linearElement,
    edgePointIndex,
  );
  const adjacentPoint = getPointAtIndexGlobalCoordinates(
    linearElement,
    adjacentPointIndex,
  );
  return {
    focus: determineFocusDistance(hoveredElement, adjacentPoint, edgePoint),
    gap: Math.max(1, distanceToBindableElement(hoveredElement, edgePoint)),
  };
};

export const getPointAtIndexGlobalCoordinates = (
  element: NonDeleted<ExcalidrawLinearElement>,
  indexMaybeFromEnd: number, // -1 for last element
): ExPoint => {
  const index =
    indexMaybeFromEnd < 0
      ? element.points.length + indexMaybeFromEnd
      : indexMaybeFromEnd;
  const [x1, y1, x2, y2] = getElementAbsoluteCoords(element);
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;

  const point = element.points[index];
  const { x, y } = element;
  return rotate(x + point[0], y + point[1], cx, cy, element.angle);
};


export const determineFocusDistance = (
  element: ExcalidrawBindableElement,
  // Point on the line, in absolute coordinates
  a: ExPoint,
  // Another point on the line, in absolute coordinates (closer to element)
  b: ExPoint,
): number => {
  const relateToCenter = relativizationToElementCenter(element);
  const aRel = GATransform.apply(relateToCenter, GAPoint.from(a));
  const bRel = GATransform.apply(relateToCenter, GAPoint.from(b));
  const line = GALine.through(aRel, bRel);
  const q = element.height / element.width;
  const hwidth = element.width / 2;
  const hheight = element.height / 2;
  const n = line[2];
  const m = line[3];
  const c = line[1];
  const mabs = Math.abs(m);
  const nabs = Math.abs(n);
  switch (element.type) {
    case "rectangle":
    case "image":
    case "text":
      return c / (hwidth * (nabs + q * mabs));
    case "diamond":
      return mabs < nabs ? c / (nabs * hwidth) : c / (mabs * hheight);
    case "ellipse":
      return c / (hwidth * Math.sqrt(n ** 2 + q ** 2 * m ** 2));
  }
};

export const distanceToBindableElement = (
  element: ExcalidrawBindableElement,
  point: ExPoint,
): number => {
  switch (element.type) {
    case "rectangle":
    case "image":
    case "text":
      return distanceToRectangle(element, point);
    case "diamond":
      return distanceToDiamond(element, point);
    case "ellipse":
      return distanceToEllipse(element, point);
  }
};

const relativizationToElementCenter = (
  element: ExcalidrawElement,
): GA.Transform => {
  const elementCoords = getElementAbsoluteCoords(element);
  const center = coordsCenter(elementCoords);
  // GA has angle orientation opposite to `rotate`
  const rotate = GATransform.rotation(center, element.angle);
  const translate = GA.reverse(
    GATransform.translation(GADirection.from(center)),
  );
  return GATransform.compose(rotate, translate);
};

const coordsCenter = ([ax, ay, bx, by]: Bounds): GA.Point => {
  return GA.point((ax + bx) / 2, (ay + by) / 2);
};

// x and y position of top left corner, x and y position of bottom right corner
export type Bounds = readonly [number, number, number, number];

const distanceToRectangle = (
  element:
    | ExcalidrawRectangleElement
    | ExcalidrawTextElement
    | ExcalidrawImageElement,
  point: ExPoint,
): number => {
  const [, pointRel, hwidth, hheight] = pointRelativeToElement(element, point);
  return Math.max(
    GAPoint.distanceToLine(pointRel, GALine.equation(0, 1, -hheight)),
    GAPoint.distanceToLine(pointRel, GALine.equation(1, 0, -hwidth)),
  );
};

const distanceToDiamond = (
  element: ExcalidrawDiamondElement,
  point: ExPoint,
): number => {
  const [, pointRel, hwidth, hheight] = pointRelativeToElement(element, point);
  const side = GALine.equation(hheight, hwidth, -hheight * hwidth);
  return GAPoint.distanceToLine(pointRel, side);
};

// Returns:
//   1. the point relative to the elements (x, y) position
//   2. the point relative to the element's center with positive (x, y)
//   3. half element width
//   4. half element height
//
// Note that for linear elements the (x, y) position is not at the
// top right corner of their boundary.
//
// Rectangles, diamonds and ellipses are symmetrical over axes,
// and other elements have a rectangular boundary,
// so we only need to perform hit tests for the positive quadrant.
const pointRelativeToElement = (
  element: ExcalidrawElement,
  pointTuple: ExPoint,
): [GA.Point, GA.Point, number, number] => {
  const point = GAPoint.from(pointTuple);
  const elementCoords = getElementAbsoluteCoords(element);
  const center = coordsCenter(elementCoords);
  // GA has angle orientation opposite to `rotate`
  const rotate = GATransform.rotation(center, element.angle);
  const pointRotated = GATransform.apply(rotate, point);
  const pointRelToCenter = GA.sub(pointRotated, GADirection.from(center));
  const pointRelToCenterAbs = GAPoint.abs(pointRelToCenter);
  const elementPos = GA.offset(element.x, element.y);
  const pointRelToPos = GA.sub(pointRotated, elementPos);
  const [ax, ay, bx, by] = elementCoords;
  const halfWidth = (bx - ax) / 2;
  const halfHeight = (by - ay) / 2;
  return [pointRelToPos, pointRelToCenterAbs, halfWidth, halfHeight];
};

const distanceToEllipse = (
  element: ExcalidrawEllipseElement,
  point: ExPoint,
): number => {
  const [pointRel, tangent] = ellipseParamsForTest(element, point);
  return -GALine.sign(tangent) * GAPoint.distanceToLine(pointRel, tangent);
};

const ellipseParamsForTest = (
  element: ExcalidrawEllipseElement,
  point: ExPoint,
): [GA.Point, GA.Line] => {
  const [, pointRel, hwidth, hheight] = pointRelativeToElement(element, point);
  const [px, py] = GAPoint.toTuple(pointRel);

  // We're working in positive quadrant, so start with `t = 45deg`, `tx=cos(t)`
  let tx = 0.707;
  let ty = 0.707;

  const a = hwidth;
  const b = hheight;

  // This is a numerical method to find the params tx, ty at which
  // the ellipse has the closest point to the given point
  [0, 1, 2, 3].forEach((_) => {
    const xx = a * tx;
    const yy = b * ty;

    const ex = ((a * a - b * b) * tx ** 3) / a;
    const ey = ((b * b - a * a) * ty ** 3) / b;

    const rx = xx - ex;
    const ry = yy - ey;

    const qx = px - ex;
    const qy = py - ey;

    const r = Math.hypot(ry, rx);
    const q = Math.hypot(qy, qx);

    tx = Math.min(1, Math.max(0, ((qx * r) / q + ex) / a));
    ty = Math.min(1, Math.max(0, ((qy * r) / q + ey) / b));
    const t = Math.hypot(ty, tx);
    tx /= t;
    ty /= t;
  });

  const closestPoint = GA.point(a * tx, b * ty);

  const tangent = GALine.orthogonalThrough(pointRel, closestPoint);
  return [pointRel, tangent];
};


// Returns 2 or 0 intersection points between line going through `a` and `b`
// and the `element`, in ascending order of distance from `a`.
export const intersectElementWithLine = (
  element: ExcalidrawBindableElement,
  // Point on the line, in absolute coordinates
  a: ExPoint,
  // Another point on the line, in absolute coordinates
  b: ExPoint,
  // If given, the element is inflated by this value
  gap = 0,
): ExPoint[] => {
  const relateToCenter = relativizationToElementCenter(element);
  const aRel = GATransform.apply(relateToCenter, GAPoint.from(a));
  const bRel = GATransform.apply(relateToCenter, GAPoint.from(b));
  const line = GALine.through(aRel, bRel);
  const reverseRelateToCenter = GA.reverse(relateToCenter);
  const intersections = getSortedElementLineIntersections(
    element,
    line,
    aRel,
    gap,
  );
  return intersections.map((point) =>
    GAPoint.toTuple(GATransform.apply(reverseRelateToCenter, point)),
  );
};

// Returns intersection of `line` with `segment`, with `segment` moved by
// `gap` in its polar direction.
// If intersection coincides with second segment point returns empty array.
const intersectSegment = (
  line: GA.Line,
  segment: [GA.Point, GA.Point],
): GA.Point[] => {
  const [a, b] = segment;
  const aDist = GAPoint.distanceToLine(a, line);
  const bDist = GAPoint.distanceToLine(b, line);
  if (aDist * bDist >= 0) {
    // The intersection is outside segment `(a, b)`
    return [];
  }
  return [GAPoint.intersect(line, GALine.through(a, b))];
};

const offsetSegment = (
  segment: [GA.Point, GA.Point],
  distance: number,
): [GA.Point, GA.Point] => {
  const [a, b] = segment;
  const offset = GATransform.translationOrthogonal(
    GADirection.fromTo(a, b),
    distance,
  );
  return [GATransform.apply(offset, a), GATransform.apply(offset, b)];
};

const getEllipseIntersections = (
  element: ExcalidrawEllipseElement,
  gap: number,
  line: GA.Line,
): GA.Point[] => {
  const a = element.width / 2 + gap;
  const b = element.height / 2 + gap;
  const m = line[2];
  const n = line[3];
  const c = line[1];
  const squares = a * a * m * m + b * b * n * n;
  const discr = squares - c * c;
  if (squares === 0 || discr <= 0) {
    return [];
  }
  const discrRoot = Math.sqrt(discr);
  const xn = -a * a * m * c;
  const yn = -b * b * n * c;
  return [
    GA.point(
      (xn + a * b * n * discrRoot) / squares,
      (yn - a * b * m * discrRoot) / squares,
    ),
    GA.point(
      (xn - a * b * n * discrRoot) / squares,
      (yn + a * b * m * discrRoot) / squares,
    ),
  ];
};

export const getCircleIntersections = (
  center: GA.Point,
  radius: number,
  line: GA.Line,
): GA.Point[] => {
  if (radius === 0) {
    return GAPoint.distanceToLine(line, center) === 0 ? [center] : [];
  }
  const m = line[2];
  const n = line[3];
  const c = line[1];
  const [a, b] = GAPoint.toTuple(center);
  const r = radius;
  const squares = m * m + n * n;
  const discr = r * r * squares - (m * a + n * b + c) ** 2;
  if (squares === 0 || discr <= 0) {
    return [];
  }
  const discrRoot = Math.sqrt(discr);
  const xn = a * n * n - b * m * n - m * c;
  const yn = b * m * m - a * m * n - n * c;

  return [
    GA.point((xn + n * discrRoot) / squares, (yn - m * discrRoot) / squares),
    GA.point((xn - n * discrRoot) / squares, (yn + m * discrRoot) / squares),
  ];
};

const getCorners = (
  element:
    | ExcalidrawRectangleElement
    | ExcalidrawImageElement
    | ExcalidrawDiamondElement
    | ExcalidrawTextElement,
  scale = 1,
): GA.Point[] => {
  const hx = (scale * element.width) / 2;
  const hy = (scale * element.height) / 2;
  switch (element.type) {
    case "rectangle":
    case "image":
    case "text":
      return [
        GA.point(hx, hy),
        GA.point(hx, -hy),
        GA.point(-hx, -hy),
        GA.point(-hx, hy),
      ];
    case "diamond":
      return [
        GA.point(0, hy),
        GA.point(hx, 0),
        GA.point(0, -hy),
        GA.point(-hx, 0),
      ];
  }
};

const getSortedElementLineIntersections = (
  element: ExcalidrawBindableElement,
  // Relative to element center
  line: GA.Line,
  // Relative to element center
  nearPoint: GA.Point,
  gap = 0,
): GA.Point[] => {
  let intersections: GA.Point[];
  switch (element.type) {
    case "rectangle":
    case "image":
    case "text":
    case "diamond":
      // eslint-disable-next-line no-case-declarations
      const corners = getCorners(element);
      intersections = corners
        .flatMap((point, i) => {
          const edge: [GA.Point, GA.Point] = [point, corners[(i + 1) % 4]];
          return intersectSegment(line, offsetSegment(edge, gap));
        })
        .concat(
          corners.flatMap((point) => getCircleIntersections(point, gap, line)),
        );
      break;
    case "ellipse":
      intersections = getEllipseIntersections(element, gap, line);
      break;
  }
  if (intersections.length < 2) {
    // Ignore the "edge" case of only intersecting with a single corner
    return [];
  }
  const sortedIntersections = intersections.sort(
    (i1, i2) =>
      GAPoint.distance(i1, nearPoint) - GAPoint.distance(i2, nearPoint),
  );
  return [
    sortedIntersections[0],
    sortedIntersections[sortedIntersections.length - 1],
  ];
};

export const determineFocusPoint = (
  element: ExcalidrawBindableElement,
  // The oriented, relative distance from the center of `element` of the
  // returned focusPoint
  focus: number,
  adjecentPoint: ExPoint,
): ExPoint => {
  if (focus === 0) {
    const elementCoords = getElementAbsoluteCoords(element);
    const center = coordsCenter(elementCoords);
    return GAPoint.toTuple(center);
  }
  const relateToCenter = relativizationToElementCenter(element);
  const adjecentPointRel = GATransform.apply(
    relateToCenter,
    GAPoint.from(adjecentPoint),
  );
  const reverseRelateToCenter = GA.reverse(relateToCenter);
  let point;
  switch (element.type) {
    case "rectangle":
    case "image":
    case "text":
    case "diamond":
      point = findFocusPointForRectangulars(element, focus, adjecentPointRel);
      break;
    case "ellipse":
      point = findFocusPointForEllipse(element, focus, adjecentPointRel);
      break;
  }
  return GAPoint.toTuple(GATransform.apply(reverseRelateToCenter, point));
};

export const findFocusPointForRectangulars = (
  element:
    | ExcalidrawRectangleElement
    | ExcalidrawImageElement
    | ExcalidrawDiamondElement
    | ExcalidrawTextElement,
  // Between -1 and 1 for how far away should the focus point be relative
  // to the size of the element. Sign determines orientation.
  relativeDistance: number,
  // The point for which we're trying to find the focus point, relative
  // to the element center.
  point: GA.Point,
): GA.Point => {
  const relativeDistanceAbs = Math.abs(relativeDistance);
  const orientation = Math.sign(relativeDistance);
  const corners = getCorners(element, relativeDistanceAbs);

  let maxDistance = 0;
  let tangentPoint: null | GA.Point = null;
  corners.forEach((corner) => {
    const distance = orientation * GALine.through(point, corner)[1];
    if (distance > maxDistance) {
      maxDistance = distance;
      tangentPoint = corner;
    }
  });
  return tangentPoint!;
};


// The focus point is the tangent point of the "focus image" of the
// `element`, where the tangent goes through `point`.
export const findFocusPointForEllipse = (
  ellipse: ExcalidrawEllipseElement,
  // Between -1 and 1 (not 0) the relative size of the "focus image" of
  // the element on which the focus point lies
  relativeDistance: number,
  // The point for which we're trying to find the focus point, relative
  // to the ellipse center.
  point: GA.Point,
): GA.Point => {
  const relativeDistanceAbs = Math.abs(relativeDistance);
  const a = (ellipse.width * relativeDistanceAbs) / 2;
  const b = (ellipse.height * relativeDistanceAbs) / 2;

  const orientation = Math.sign(relativeDistance);
  const [px, pyo] = GAPoint.toTuple(point);

  // The calculation below can't handle py = 0
  const py = pyo === 0 ? 0.0001 : pyo;

  const squares = px ** 2 * b ** 2 + py ** 2 * a ** 2;
  // Tangent mx + ny + 1 = 0
  const m =
    (-px * b ** 2 +
      orientation * py * Math.sqrt(Math.max(0, squares - a ** 2 * b ** 2))) /
    squares;

  const n = (-m * px - 1) / py;

  const x = -(a ** 2 * m) / (n ** 2 * b ** 2 + m ** 2 * a ** 2);
  return GA.point(x, (-m * x - 1) / n);
};
