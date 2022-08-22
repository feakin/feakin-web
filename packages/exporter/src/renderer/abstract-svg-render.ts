export class AbstractSvgRender {
  moveTo(x: number, y: number) {
    return 'M ' + x + ' ' + y + ' ';
  }

  lineTo(x: number, y: number) {
    return 'L ' + x + ' ' + y + ' ';
  }

  quadTo(x1: number, y1: number, x2: number, y2: number) {
    return 'Q ' + x1 + ' ' + y1 + ' ' + x2 + ' ' + y2 + ' ';
  }

  curveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    return 'C ' + x1 + ' ' + y1 + ' ' + x2 + ' ' + y2 + ' ' + x3 + ' ' + y3 + ' ';
  }

  close() {
    return 'Z';
  }
}
