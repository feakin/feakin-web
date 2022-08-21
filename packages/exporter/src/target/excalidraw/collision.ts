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
import { ExPoint, ExcalidrawBindableElement, ExcalidrawElement } from "./excalidraw-types";

import * as GA from "./ga/ga";
import * as GAPoint from "./ga/gapoints";
import * as GADirection from "./ga/gadirections";
import * as GALine from "./ga/galines";
import * as GATransform from "./ga/gatransforms";

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

// If the element is created from right to left, the width is going to be negative
// This set of functions retrieves the absolute position of the 4 points.
export const getElementAbsoluteCoords = (
  element: ExcalidrawElement,
): Bounds => {
  // if (isFreeDrawElement(element)) {
  //   return getFreeDrawElementAbsoluteCoords(element);
  // } else if (isLinearElement(element)) {
  //   return getLinearElementAbsoluteCoords(element);
  // }
  return [
    element.x,
    element.y,
    element.x + element.width,
    element.y + element.height,
  ];
};
