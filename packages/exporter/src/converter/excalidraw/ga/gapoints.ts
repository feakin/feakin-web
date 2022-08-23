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

import * as GA from "./ga";
import * as GALine from "./galines";
import { Point, Line, join } from "./ga";

export const from = ([x, y]: readonly [number, number]): Point => [
  0,
  0,
  0,
  0,
  y,
  x,
  1,
  0,
];

export const toTuple = (point: Point): [number, number] => [point[5], point[4]];

export const abs = (point: Point): Point => [
  0,
  0,
  0,
  0,
  Math.abs(point[4]),
  Math.abs(point[5]),
  1,
  0,
];

export const intersect = (line1: Line, line2: Line): Point =>
  GA.normalized(GA.meet(line1, line2));

// Projects `point` onto the `line`.
// The returned point is the closest point on the `line` to the `point`.
export const project = (point: Point, line: Line): Point =>
  intersect(GALine.orthogonal(line, point), line);

export const distance = (point1: Point, point2: Point): number =>
  GA.norm(join(point1, point2));

export const distanceToLine = (point: Point, line: Line): number =>
  GA.joinScalar(point, line);
