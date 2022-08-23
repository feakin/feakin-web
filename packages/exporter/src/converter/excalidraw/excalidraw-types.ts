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
export declare type RoughPoint = [number, number];
export type ExPoint = Readonly<RoughPoint>;

type MarkNonNullable<T, K extends keyof T> = {
  [P in K]-?: P extends K ? NonNullable<T[P]> : T[P];
} & { [P in keyof T]: T[P] };

// 1-based in case we ever do `if(element.fontFamily)`
export const FONT_FAMILY = {
  Virgil: 1,
  Helvetica: 2,
  Cascadia: 3,
};

export const THEME = {
  LIGHT: "light",
  DARK: "dark",
};

export const VERTICAL_ALIGN = {
  TOP: "top",
  MIDDLE: "middle",
  BOTTOM: "bottom",
};

export type ChartType = "bar" | "line";
export type FillStyle = "hachure" | "cross-hatch" | "solid";
export type FontFamilyKeys = keyof typeof FONT_FAMILY;
export type FontFamilyValues = typeof FONT_FAMILY[FontFamilyKeys];
export type Theme = typeof THEME[keyof typeof THEME];
export type FontString = string & { _brand: "fontString" };
export type GroupId = string;
export type PointerType = "mouse" | "pen" | "touch";
export type StrokeSharpness = "round" | "sharp";
export type StrokeStyle = "solid" | "dashed" | "dotted";
export type TextAlign = "left" | "center" | "right";

type VerticalAlignKeys = keyof typeof VERTICAL_ALIGN;
export type VerticalAlign = typeof VERTICAL_ALIGN[VerticalAlignKeys];

type _ExcalidrawElementBase = Readonly<{
  id: string;
  x: number;
  y: number;
  strokeColor: string;
  backgroundColor: string;
  fillStyle: FillStyle;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  strokeSharpness: StrokeSharpness;
  roughness: number;
  opacity: number;
  width: number;
  height: number;
  angle: number;
  /** Random integer used to seed shape generation so that the roughjs shape
   doesn't differ across renders. */
  seed: number;
  /** Integer that is sequentially incremented on each change. Used to reconcile
   elements during collaboration or when saving to server. */
  version: number;
  /** Random integer that is regenerated on each change.
   Used for deterministic reconciliation of updates during collaboration,
   in case the versions (see above) are identical. */
  versionNonce: number;
  isDeleted: boolean;
  /** List of groups the element belongs to.
   Ordered from deepest to shallowest. */
  groupIds: readonly GroupId[];
  /** other elements that are bound to this element */
  boundElements:
    | readonly Readonly<{
    id: ExcalidrawLinearElement["id"];
    type: "arrow" | "text";
  }>[]
    | null;
  /** epoch (ms) timestamp of last element update */
  updated: number;
  link: string | null;
  locked: boolean;
}>;

export type ExcalidrawSelectionElement = _ExcalidrawElementBase & {
  type: "selection";
};

export type ExcalidrawRectangleElement = _ExcalidrawElementBase & {
  type: "rectangle";
};

export type ExcalidrawDiamondElement = _ExcalidrawElementBase & {
  type: "diamond";
};

export type ExcalidrawEllipseElement = _ExcalidrawElementBase & {
  type: "ellipse";
};

export type ExcalidrawImageElement = _ExcalidrawElementBase &
  Readonly<{
    type: "image";
    fileId: FileId | null;
    /** whether respective file is persisted */
    status: "pending" | "saved" | "error";
    /** X and Y scale factors <-1, 1>, used for image axis flipping */
    scale: [number, number];
  }>;

export type InitializedExcalidrawImageElement = MarkNonNullable<
  ExcalidrawImageElement,
  "fileId"
  >;

/**
 * These are elements that don't have any additional properties.
 */
export type ExcalidrawGenericElement =
  | ExcalidrawSelectionElement
  | ExcalidrawRectangleElement
  | ExcalidrawDiamondElement
  | ExcalidrawEllipseElement;

/**
 * ExcalidrawElement should be JSON serializable and (eventually) contain
 * no computed data. The list of all ExcalidrawElements should be shareable
 * between peers and contain no state local to the peer.
 */
export type ExcalidrawElement =
  | ExcalidrawGenericElement
  | ExcalidrawTextElement
  | ExcalidrawLinearElement
  | ExcalidrawFreeDrawElement
  | ExcalidrawImageElement;

export type NonDeleted<TElement extends ExcalidrawElement> = TElement & {
  isDeleted: boolean;
};

export type NonDeletedExcalidrawElement = NonDeleted<ExcalidrawElement>;

export type ExcalidrawTextElement = _ExcalidrawElementBase &
  Readonly<{
    type: "text";
    fontSize: number;
    fontFamily: FontFamilyValues;
    text: string;
    baseline: number;
    textAlign: TextAlign;
    verticalAlign: VerticalAlign;
    containerId: ExcalidrawGenericElement["id"] | null;
    originalText: string;
  }>;

export type ExcalidrawBindableElement =
  | ExcalidrawRectangleElement
  | ExcalidrawDiamondElement
  | ExcalidrawEllipseElement
  | ExcalidrawTextElement
  | ExcalidrawImageElement;

export type ExcalidrawTextContainer =
  | ExcalidrawRectangleElement
  | ExcalidrawDiamondElement
  | ExcalidrawEllipseElement
  | ExcalidrawImageElement;

export type ExcalidrawTextElementWithContainer = {
  containerId: ExcalidrawTextContainer["id"];
} & ExcalidrawTextElement;

export type PointBinding = {
  elementId: ExcalidrawBindableElement["id"];
  focus: number;
  gap: number;
};

export type Arrowhead = "arrow" | "bar" | "dot" | "triangle";

export type ExcalidrawLinearElement = _ExcalidrawElementBase &
  Readonly<{
    type: "line" | "arrow";
    points: readonly ExPoint[];
    lastCommittedPoint: ExPoint | null;
    startBinding: PointBinding | null;
    endBinding: PointBinding | null;
    startArrowhead: Arrowhead | null;
    endArrowhead: Arrowhead | null;
  }>;

export type ExcalidrawFreeDrawElement = _ExcalidrawElementBase &
  Readonly<{
    type: "freedraw";
    points: readonly ExPoint[];
    pressures: readonly number[];
    simulatePressure: boolean;
    lastCommittedPoint: ExPoint | null;
  }>;

export type FileId = string & { _brand: "FileId" };
