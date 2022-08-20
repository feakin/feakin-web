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
import { Line, Direction, Point, Transform } from "./ga";
import * as GADirection from "./gadirections";

/**
 * TODO: docs
 */

export const rotation = (pivot: Point, angle: number): Transform =>
  GA.add(GA.mul(pivot, Math.sin(angle / 2)), Math.cos(angle / 2));

export const translation = (direction: Direction): Transform => [
  1,
  0,
  0,
  0,
  -(0.5 * direction[5]),
  0.5 * direction[4],
  0,
  0,
];

export const translationOrthogonal = (
  direction: Direction,
  distance: number,
): Transform => {
  const scale = 0.5 * distance;
  return [1, 0, 0, 0, scale * direction[4], scale * direction[5], 0, 0];
};

export const translationAlong = (line: Line, distance: number): Transform =>
  GA.add(GA.mul(GADirection.orthogonalToLine(line), 0.5 * distance), 1);

export const compose = (motor1: Transform, motor2: Transform): Transform =>
  GA.mul(motor2, motor1);

export const apply = (
  motor: Transform,
  nvector: Point | Direction | Line,
): Point | Direction | Line =>
  GA.normalized(GA.mul(GA.mul(motor, nvector), GA.reverse(motor)));
