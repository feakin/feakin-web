export enum LineType {
  LINE = 'line',
  ARROW = 'arrow',
  POLYLINE = 'polyline',
  CURVE = 'curve',
  SCRIBBLE = 'scribble',
}

export class LineTypeImpl {
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

