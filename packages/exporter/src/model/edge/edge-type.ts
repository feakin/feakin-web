export enum EdgeType {
  LINE = 'line',
  ARROW = 'arrow',
  POLYLINE = 'polyline',
  CURVE = 'curve',
  SCRIBBLE = 'scribble',
}

export enum EdgeConnectorType {
  ELBOW = 'elbow',
  CURVE = 'curve',
}

export enum LineStyle {
  SOLID = 'solid',
  DOT = 'dot',
  DASH = 'dash',
  DOT_DASH = 'dot-dash',
  LONG_DASH = 'long-dash',
  LONG_DASH_DOT = 'long-dash-dot',
}

export enum ArrowType {
  NONE = 'none',
  NOTCHED = 'notched',
  HOLLOW = 'hollow',
  HOLLOW_CIRCLE = 'hollow-circle',
  HOLLOW_SQUARE = 'hollow-square',
  HOLLOW_DIAMOND = 'hollow-diamond',
  FILLED = 'filled',
  FILLED_CIRCLE = 'filled-circle',
  FILLED_SQUARE = 'filled-square',
  FILLED_DIAMOND = 'filled-diamond',
}

export interface ArrowStyle {
  startType: ArrowType;
  endType: ArrowType;
  lineStyle: LineStyle;
}

export const defaultArrowStyle: ArrowStyle = {
  endType: ArrowType.NONE,
  startType: ArrowType.NONE,
  lineStyle: LineStyle.SOLID
}

export class EdgeTypeUtils {
  static fromString(type: string): EdgeType | undefined {
    switch (type) {
      case 'line':
        return EdgeType.LINE;
      case 'arrow':
        return EdgeType.ARROW;
      case 'polyline':
        return EdgeType.POLYLINE;
      case 'curve':
        return EdgeType.CURVE;
      case 'scribble':
        return EdgeType.SCRIBBLE;
      default:
        return undefined;
    }
  }
}

