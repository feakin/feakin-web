// refs to https://www.moxiegroup.com/moxieapps/gwt-highcharts/apidocs/org/moxieapps/gwt/highcharts/client/PlotLine.DashStyle.html
export enum LineStyle {
  // ──────
  SOLID = 'solid',
  // ······
  DOT = 'dot',
  // -- -- -- --
  DASH = 'dash',
  // .-- .-- .--
  DOT_DASH = 'dot-dash',
  // -- -- --
  LONG_DASH = 'long-dash',
  // --·--·--
  LONG_DASH_DOT = 'long-dash-dot',
  // - - - -
  SHORT_DASH = 'short-dash',
  // -·-·-·-
  SHORT_DASH_DOT = 'short-dash-dot',
}

export class LineStyleImpl {
  static toDashPattern(style: LineStyle, strokeWidth: number): number[] {
    switch (style) {
      case LineStyle.SOLID:
        return [];
      case LineStyle.DASH:
        return [strokeWidth, strokeWidth, 0];
      case LineStyle.DOT:
        return [0, strokeWidth];
      case LineStyle.DOT_DASH:
        return [0, strokeWidth * 2, strokeWidth, strokeWidth * 2];
      case LineStyle.LONG_DASH:
        return [strokeWidth, strokeWidth, strokeWidth, 0];
      case LineStyle.LONG_DASH_DOT:
        return [0, strokeWidth, strokeWidth * 4, strokeWidth];
      case LineStyle.SHORT_DASH:
        return [strokeWidth, strokeWidth * 2];
      case LineStyle.SHORT_DASH_DOT:
        return [0, strokeWidth, strokeWidth, strokeWidth];
    }
  }

  static createForTestOnly(style: LineStyle, strokeWidth: number): string {
    let output = '';
    const piece = LineStyleImpl.toDashPattern(style, strokeWidth);
    for (const dash of piece) {
      const mod = dash / strokeWidth;

      switch (mod) {
        case 0:
          output += '·';
          break;
        case 1:
          output += '-';
          break;
        case 2:
          output += '--';
          break;
        case 4:
          output += '---';
          break;
        default:
          output += ' ';
          break;
      }
    }

    return output;
  }
}
