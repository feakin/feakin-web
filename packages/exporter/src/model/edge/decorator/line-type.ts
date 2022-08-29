export enum LineType {
  LINE = 'line',
  ARROW = 'arrow',
  POLYLINE = 'polyline',
  CURVE = 'curve',
  SCRIBBLE = 'scribble',
}

export enum LineStyle {
  SOLID = 'solid',
  DOT = 'dot',
  DASH = 'dash',
  DOT_DASH = 'dot-dash',
  LONG_DASH = 'long-dash',
  LONG_DASH_DOT = 'long-dash-dot',
}

export function LineStyleExt(style: LineStyle, strokeWidth: number): string {
  switch (style) {
    case LineStyle.DASH:
      return `${strokeWidth} ${strokeWidth * 2}`;
    case LineStyle.DOT:
      return `${strokeWidth} ${strokeWidth * 2}`;
    case LineStyle.DOT_DASH:
      return `${strokeWidth} ${strokeWidth * 2} ${strokeWidth} ${strokeWidth * 2}`;
    case LineStyle.LONG_DASH:
      return `${strokeWidth} ${strokeWidth * 4}`;
    case LineStyle.LONG_DASH_DOT:
      return `${strokeWidth} ${strokeWidth * 4} ${strokeWidth} ${strokeWidth * 2}`;
    default:
      return '';
  }
}

export class EdgeTypeUtils {
  static fromString(type: string): LineType | undefined {
    switch (type) {
      case 'line':
        return LineType.LINE;
      case 'arrow':
        return LineType.ARROW;
      case 'polyline':
        return LineType.POLYLINE;
      case 'curve':
        return LineType.CURVE;
      case 'scribble':
        return LineType.SCRIBBLE;
      default:
        return undefined;
    }
  }
}

