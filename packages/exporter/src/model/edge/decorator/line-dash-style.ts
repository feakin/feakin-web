// refs to https://www.moxiegroup.com/moxieapps/gwt-highcharts/apidocs/org/moxieapps/gwt/highcharts/client/PlotLine.DashStyle.html
export enum LineDashStyle {
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

export class LineDashStyleImpl {
  static toCanvasDashLine(style: LineDashStyle, strokeWidth: number): number[] {
    switch (style) {
      case LineDashStyle.SOLID:
        return [];
      case LineDashStyle.DASH:
        return [strokeWidth * 2, strokeWidth];
      case LineDashStyle.DOT:
        return [strokeWidth, strokeWidth];
      case LineDashStyle.DOT_DASH:
        return [strokeWidth * 2, strokeWidth, strokeWidth, strokeWidth];
      case LineDashStyle.LONG_DASH:
        return [strokeWidth * 4, strokeWidth];
      case LineDashStyle.LONG_DASH_DOT:
        return [strokeWidth * 4, strokeWidth, strokeWidth, strokeWidth];
      case LineDashStyle.SHORT_DASH:
        return [strokeWidth * 2, strokeWidth];
      case LineDashStyle.SHORT_DASH_DOT:
        return [strokeWidth * 2, strokeWidth, strokeWidth, strokeWidth];
      default:
        throw new Error(`Unknown line dash style: ${style}`);
    }
  }

  static createForTestOnly(style: LineDashStyle, strokeWidth: number): string {
    let output = '';
    const piece = LineDashStyleImpl.toCanvasDashLine(style, strokeWidth);
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
          output += '=';
          break;
        case 4:
          output += '#';
          break;
        default:
          output += ' ';
          break;
      }
    }

    return output;
  }
}
