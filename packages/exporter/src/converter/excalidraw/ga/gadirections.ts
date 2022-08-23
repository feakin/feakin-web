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
import { Line, Direction, Point } from "./ga";

/**
 * A direction is stored as an array `[0, 0, 0, 0, y, x, 0, 0]` representing
 * vector `(x, y)`.
 */

export const from = (point: Point): Point => [
  0,
  0,
  0,
  0,
  point[4],
  point[5],
  0,
  0,
];

export const fromTo = (from: Point, to: Point): Direction =>
  GA.inormalized([0, 0, 0, 0, to[4] - from[4], to[5] - from[5], 0, 0]);

export const orthogonal = (direction: Direction): Direction =>
  GA.inormalized([0, 0, 0, 0, -direction[5], direction[4], 0, 0]);

export const orthogonalToLine = (line: Line): Direction => GA.mul(line, GA.I);
