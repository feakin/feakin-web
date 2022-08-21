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

import { ExcalidrawElement, ExcalidrawFreeDrawElement, ExcalidrawLinearElement, ExPoint } from "@feakin/exporter";
import { Bounds } from "./collision";
import { rotate } from "./math";
import { isFreeDrawElement, isLinearElement } from "./type-check";
import { Drawable, Op } from "roughjs/bin/core";

export const getElementBounds = (
  element: ExcalidrawElement,
): [number, number, number, number] => {
  let bounds: [number, number, number, number];

  const [x1, y1, x2, y2] = getElementAbsoluteCoords(element);
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  if (isFreeDrawElement(element)) {
    const [minX, minY, maxX, maxY] = getBoundsFromPoints(
      element.points.map(([x, y]) =>
        rotate(x, y, cx - element.x, cy - element.y, element.angle),
      ),
    );

    return [
      minX + element.x,
      minY + element.y,
      maxX + element.x,
      maxY + element.y,
    ];
  } else if (isLinearElement(element)) {
    bounds = getLinearElementRotatedBounds(element, cx, cy);
  } else if (element.type === "diamond") {
    const [x11, y11] = rotate(cx, y1, cx, cy, element.angle);
    const [x12, y12] = rotate(cx, y2, cx, cy, element.angle);
    const [x22, y22] = rotate(x1, cy, cx, cy, element.angle);
    const [x21, y21] = rotate(x2, cy, cx, cy, element.angle);
    const minX = Math.min(x11, x12, x22, x21);
    const minY = Math.min(y11, y12, y22, y21);
    const maxX = Math.max(x11, x12, x22, x21);
    const maxY = Math.max(y11, y12, y22, y21);
    bounds = [minX, minY, maxX, maxY];
  } else if (element.type === "ellipse") {
    const w = (x2 - x1) / 2;
    const h = (y2 - y1) / 2;
    const cos = Math.cos(element.angle);
    const sin = Math.sin(element.angle);
    const ww = Math.hypot(w * cos, h * sin);
    const hh = Math.hypot(h * cos, w * sin);
    bounds = [cx - ww, cy - hh, cx + ww, cy + hh];
  } else {
    const [x11, y11] = rotate(x1, y1, cx, cy, element.angle);
    const [x12, y12] = rotate(x1, y2, cx, cy, element.angle);
    const [x22, y22] = rotate(x2, y2, cx, cy, element.angle);
    const [x21, y21] = rotate(x2, y1, cx, cy, element.angle);
    const minX = Math.min(x11, x12, x22, x21);
    const minY = Math.min(y11, y12, y22, y21);
    const maxX = Math.max(x11, x12, x22, x21);
    const maxY = Math.max(y11, y12, y22, y21);
    bounds = [minX, minY, maxX, maxY];
  }

  return bounds;
};

const shapeCache = new WeakMap<ExcalidrawElement, ElementShape>();

type ElementShape = Drawable | Drawable[] | null;

type ElementShapes = {
  freedraw: Drawable | null;
  arrow: Drawable[];
  line: Drawable[];
  text: null;
  image: null;
};
export const getShapeForElement = <T extends ExcalidrawElement>(element: T) =>
  shapeCache.get(element) as T["type"] extends keyof ElementShapes
    ? ElementShapes[T["type"]] | undefined
    : Drawable | null | undefined;

const getLinearElementRotatedBounds = (
  element: ExcalidrawLinearElement,
  cx: number,
  cy: number,
): [number, number, number, number] => {
  if (element.points.length < 2 || !getShapeForElement(element)) {
    // XXX this is just a poor estimate and not very useful
    const { minX, minY, maxX, maxY } = element.points.reduce(
      (limits, [x, y]) => {
        [x, y] = rotate(element.x + x, element.y + y, cx, cy, element.angle);
        limits.minY = Math.min(limits.minY, y);
        limits.minX = Math.min(limits.minX, x);
        limits.maxX = Math.max(limits.maxX, x);
        limits.maxY = Math.max(limits.maxY, y);
        return limits;
      },
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
    );
    return [minX, minY, maxX, maxY];
  }

  const shape = getShapeForElement(element)!;

  // first element is always the curve
  const ops = getCurvePathOps(shape[0]);

  const transformXY = (x: number, y: number) =>
    rotate(element.x + x, element.y + y, cx, cy, element.angle);
  return getMinMaxXYFromCurvePathOps(ops, transformXY);
};

export const getCurvePathOps = (shape: Drawable): Op[] => {
  for (const set of shape.sets) {
    if (set.type === "path") {
      return set.ops;
    }
  }
  return shape.sets[0].ops;
};

export const getCommonBounds = (
  elements: readonly ExcalidrawElement[],
): [number, number, number, number] => {
  if (!elements.length) {
    return [0, 0, 0, 0];
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  elements.forEach((element) => {
    const [x1, y1, x2, y2] = getElementBounds(element);
    minX = Math.min(minX, x1);
    minY = Math.min(minY, y1);
    maxX = Math.max(maxX, x2);
    maxY = Math.max(maxY, y2);
  });

  return [minX, minY, maxX, maxY];
};

// If the element is created from right to left, the width is going to be negative
// This set of functions retrieves the absolute position of the 4 points.
export const getElementAbsoluteCoords = (
  element: ExcalidrawElement,
): Bounds => {
  if (isFreeDrawElement(element)) {
    return getFreeDrawElementAbsoluteCoords(element);
  } else if (isLinearElement(element)) {
    return getLinearElementAbsoluteCoords(element);
  }

  return [
    element.x,
    element.y,
    element.x + element.width,
    element.y + element.height,
  ];
};


const getFreeDrawElementAbsoluteCoords = (
  element: ExcalidrawFreeDrawElement,
): [number, number, number, number] => {
  const [minX, minY, maxX, maxY] = getBoundsFromPoints(element.points);

  return [
    minX + element.x,
    minY + element.y,
    maxX + element.x,
    maxY + element.y,
  ];
};

const getLinearElementAbsoluteCoords = (
  element: ExcalidrawLinearElement,
): [number, number, number, number] => {
  let coords: [number, number, number, number];

  if (element.points.length < 2 || !getShapeForElement(element)) {
    // XXX this is just a poor estimate and not very useful
    const { minX, minY, maxX, maxY } = element.points.reduce(
      (limits, [x, y]) => {
        limits.minY = Math.min(limits.minY, y);
        limits.minX = Math.min(limits.minX, x);

        limits.maxX = Math.max(limits.maxX, x);
        limits.maxY = Math.max(limits.maxY, y);

        return limits;
      },
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
    );
    coords = [
      minX + element.x,
      minY + element.y,
      maxX + element.x,
      maxY + element.y,
    ];
  } else {
    const shape = getShapeForElement(element)!;

    // first element is always the curve
    const ops = getCurvePathOps(shape[0]);

    const [minX, minY, maxX, maxY] = getMinMaxXYFromCurvePathOps(ops);

    coords = [
      minX + element.x,
      minY + element.y,
      maxX + element.x,
      maxY + element.y,
    ];
  }

  return coords;
};

const getMinMaxXYFromCurvePathOps = (
  ops: Op[],
  transformXY?: (x: number, y: number) => [number, number],
): [number, number, number, number] => {
  let currentP: ExPoint = [0, 0];

  const { minX, minY, maxX, maxY } = ops.reduce(
    (limits, { op, data }) => {
      // There are only four operation types:
      // move, bcurveTo, lineTo, and curveTo
      if (op === "move") {
        // change starting point
        currentP = data as unknown as ExPoint;
        // move operation does not draw anything; so, it always
        // returns false
      } else if (op === "bcurveTo") {
        const _p1 = [data[0], data[1]] as ExPoint;
        const _p2 = [data[2], data[3]] as ExPoint;
        const _p3 = [data[4], data[5]] as ExPoint;

        const p1 = transformXY ? transformXY(..._p1) : _p1;
        const p2 = transformXY ? transformXY(..._p2) : _p2;
        const p3 = transformXY ? transformXY(..._p3) : _p3;

        const p0 = transformXY ? transformXY(...currentP) : currentP;
        currentP = _p3;

        const [minX, minY, maxX, maxY] = getCubicBezierCurveBound(
          p0,
          p1,
          p2,
          p3,
        );

        limits.minX = Math.min(limits.minX, minX);
        limits.minY = Math.min(limits.minY, minY);

        limits.maxX = Math.max(limits.maxX, maxX);
        limits.maxY = Math.max(limits.maxY, maxY);
      } else if (op === "lineTo") {
        // TODO: Implement this
      } else if (op === "qcurveTo") {
        // TODO: Implement this
      }
      return limits;
    },
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );
  return [minX, minY, maxX, maxY];
};

const getCubicBezierCurveBound = (
  p0: ExPoint,
  p1: ExPoint,
  p2: ExPoint,
  p3: ExPoint,
): Bounds => {
  const solX = solveQuadratic(p0[0], p1[0], p2[0], p3[0]);
  const solY = solveQuadratic(p0[1], p1[1], p2[1], p3[1]);

  let minX = Math.min(p0[0], p3[0]);
  let maxX = Math.max(p0[0], p3[0]);

  if (solX) {
    const xs = solX.filter((x) => x !== null) as number[];
    minX = Math.min(minX, ...xs);
    maxX = Math.max(maxX, ...xs);
  }

  let minY = Math.min(p0[1], p3[1]);
  let maxY = Math.max(p0[1], p3[1]);
  if (solY) {
    const ys = solY.filter((y) => y !== null) as number[];
    minY = Math.min(minY, ...ys);
    maxY = Math.max(maxY, ...ys);
  }
  return [minX, minY, maxX, maxY];
};

type MaybeQuadraticSolution = [number | null, number | null] | false;

const solveQuadratic = (
  p0: number,
  p1: number,
  p2: number,
  p3: number,
): MaybeQuadraticSolution => {
  const i = p1 - p0;
  const j = p2 - p1;
  const k = p3 - p2;

  const a = 3 * i - 6 * j + 3 * k;
  const b = 6 * j - 6 * i;
  const c = 3 * i;

  const sqrtPart = b * b - 4 * a * c;
  const hasSolution = sqrtPart >= 0;

  if (!hasSolution) {
    return false;
  }

  const t1 = (-b + Math.sqrt(sqrtPart)) / (2 * a);
  const t2 = (-b - Math.sqrt(sqrtPart)) / (2 * a);

  let s1 = null;
  let s2 = null;

  if (t1 >= 0 && t1 <= 1) {
    s1 = getBezierValueForT(t1, p0, p1, p2, p3);
  }

  if (t2 >= 0 && t2 <= 1) {
    s2 = getBezierValueForT(t2, p0, p1, p2, p3);
  }

  return [s1, s2];
};


// reference: https://eliot-jones.com/2019/12/cubic-bezier-curve-bounding-boxes
const getBezierValueForT = (
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number,
) => {
  const oneMinusT = 1 - t;
  return (
    Math.pow(oneMinusT, 3) * p0 +
    3 * Math.pow(oneMinusT, 2) * t * p1 +
    3 * oneMinusT * Math.pow(t, 2) * p2 +
    Math.pow(t, 3) * p3
  );
};

const getBoundsFromPoints = (
  points: ExcalidrawFreeDrawElement["points"],
): [number, number, number, number] => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const [x, y] of points) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  return [minX, minY, maxX, maxY];
};
