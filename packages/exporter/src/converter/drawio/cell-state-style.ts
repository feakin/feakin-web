/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 * Updated to ES9 syntax by David Morrissey 2021
 * Type definitions from the typed-mxgraph project
 */

export const enum DIRECTION {
  NORTH = 'north',
  SOUTH = 'south',
  EAST = 'east',
  WEST = 'west',
}

export type ColorValue = string;
export type DirectionValue = 'north' | 'south' | 'east' | 'west';
export type TextDirectionValue = '' | 'ltr' | 'rtl' | 'auto';
export type AlignValue = 'left' | 'center' | 'right';
export type VAlignValue = 'top' | 'middle' | 'bottom';
export type OverflowValue = 'fill' | 'width' | 'auto' | 'hidden' | 'scroll' | 'visible';
export type WhiteSpaceValue = 'normal' | 'wrap' | 'nowrap' | 'pre';
export type MxArrowType =
  | 'none'
  | 'classic'
  | 'classicThin'
  | 'block'
  | 'blockThin'
  | 'open'
  | 'openThin'
  | 'oval'
  | 'diamond'
  | 'diamondThin';
export type ShapeValue =
  | 'rectangle'
  | 'ellipse'
  | 'doubleEllipse'
  | 'rhombus'
  | 'line'
  | 'image'
  | 'arrow'
  | 'arrowConnector'
  | 'label'
  | 'cylinder'
  | 'swimlane'
  | 'connector'
  | 'actor'
  | 'cloud'
  | 'triangle'
  | 'hexagon';

export interface CellConnectorStyle {
  dashPattern?: string;
  endArrow?: MxArrowType;
  startArrow?: MxArrowType;
}

export interface CellStateStyle extends CellConnectorStyle {
  absoluteArcSize?: number;
  align?: AlignValue;
  anchorPointDirection?: boolean;
  arcSize?: number;
  aspect?: string;
  autosize?: boolean;
  backgroundColor?: ColorValue;
  backgroundOutline?: number;
  bendable?: boolean;
  cloneable?: boolean;
  curved?: boolean;
  dashed?: boolean;
  defaultEdge?: CellStateStyle;
  defaultVertex?: CellStateStyle;
  deletable?: boolean;
  direction?: DirectionValue;
  edgeStyle?: string;
  editable?: boolean;
  elbow?: string;
  endFill?: boolean;
  endSize?: number;
  entryDx?: number;
  entryDy?: number;
  entryPerimeter?: boolean;
  entryX?: number;
  entryY?: number;
  exitDx?: number;
  exitDy?: number;
  exitPerimeter?: boolean;
  exitX?: number;
  exitY?: number;
  fillColor?: ColorValue;
  fillOpacity?: number;
  fixDash?: boolean;
  flipH?: boolean;
  flipV?: boolean;
  foldable?: boolean;
  fontColor?: ColorValue;
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: number;
  glass?: boolean;
  gradientColor?: ColorValue;
  gradientDirection?: DirectionValue;
  horizontal?: boolean;
  image?: string;
  imageAlign?: AlignValue;
  imageAspect?: boolean;
  imageBackground?: ColorValue;
  imageBorder?: ColorValue;
  imageHeight?: number;
  imageWidth?: number;
  indicatorColor?: ColorValue;
  indicatorDirection?: DirectionValue;
  indicatorHeight?: number;
  indicatorImage?: string;
  indicatorShape?: string;
  indicatorStrokeColor?: ColorValue;
  indicatorWidth?: number;
  jettySize?: number | 'auto';
  labelBackgroundColor?: ColorValue;
  labelBorderColor?: ColorValue;
  labelPadding?: number;
  labelPosition?: AlignValue;
  labelWidth?: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  loop?: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  loopStyle?: Function;
  margin?: number;
  movable?: boolean;
  noEdgeStyle?: boolean;
  noLabel?: boolean;
  opacity?: number;
  orthogonal?: boolean | null;
  orthogonalLoop?: boolean;
  overflow?: OverflowValue;
  // eslint-disable-next-line @typescript-eslint/ban-types
  perimeter?: Function | string | null;
  perimeterSpacing?: number;
  pointerEvents?: boolean;
  portConstraint?: DIRECTION;
  portConstraintRotation?: DIRECTION;
  resizable?: boolean;
  resizeHeight?: boolean;
  resizeWidth?: boolean;
  rotatable?: boolean;
  rotation?: number;
  rounded?: boolean;
  routingCenterX?: number;
  routingCenterY?: number;
  segment?: number;
  separatorColor?: ColorValue;
  shadow?: boolean;
  shape?: ShapeValue;
  sourceJettySize?: number | 'auto';
  sourcePerimeterSpacing?: number;
  sourcePort?: string;
  sourcePortConstraint?: DIRECTION;
  spacing?: number;
  spacingBottom?: number;
  spacingLeft?: number;
  spacingRight?: number;
  spacingTop?: number;
  startFill?: boolean;
  startSize?: number;
  strokeColor?: ColorValue;
  strokeOpacity?: number;
  strokeWidth?: number;
  swimlaneFillColor?: ColorValue;
  swimlaneLine?: boolean;
  targetJettySize?: number | 'auto';
  targetPerimeterSpacing?: number;
  targetPort?: string;
  targetPortConstraint?: DIRECTION;
  textDirection?: TextDirectionValue;
  textOpacity?: number;
  verticalAlign?: VAlignValue;
  verticalLabelPosition?: VAlignValue;
  whiteSpace?: WhiteSpaceValue;
}
