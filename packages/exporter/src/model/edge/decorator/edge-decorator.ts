import { ArrowType } from "./arrow-type";
import { LineType } from "./line-type";
import { LineStyle } from "./line-style";

export const defaultEdgeDecorator: EdgeDecorator = {
  lineType: LineType.LINE,
  endType: ArrowType.NONE,
  startType: ArrowType.NONE,
  lineStyle: LineStyle.SOLID
}

export interface EdgeDecorator {
  lineStyle: LineStyle;
  lineType: LineType;
  startType: ArrowType;
  endType: ArrowType;
}

export function edgeDecoratorForTest(edgeDecorator: EdgeDecorator): string {
  let result = "";
  switch (edgeDecorator.startType) {
    case ArrowType.NONE:
      result += "";
      break;
    case ArrowType.NOTCHED:
      result += "<";
      break;
    case ArrowType.HOLLOW:
      result += "◁";
      break;
    case ArrowType.HOLLOW_CIRCLE:
      result += "○";
      break;
    case ArrowType.HOLLOW_SQUARE:
      result += "□";
      break;
    case ArrowType.HOLLOW_DIAMOND:
      result += "◇";
      break;
    case ArrowType.FILLED:
      result += "◀";
      break;
    case ArrowType.FILLED_CIRCLE:
      result += "●";
      break;
    case ArrowType.FILLED_SQUARE:
      result += "■";
      break;
    case ArrowType.FILLED_DIAMOND:
      result += "◆";
      break;
  }

  const lineRepeat = 5;
  switch (edgeDecorator.lineStyle) {
    case LineStyle.SOLID:
      result += "─".repeat(lineRepeat);
      break;
    case LineStyle.DASH:
      result += "-".repeat(lineRepeat);
      break;
    default:
      result += " ".repeat(lineRepeat);
  }

  switch (edgeDecorator.endType) {
    case ArrowType.NONE:
      result += "";
      break;
    case ArrowType.NOTCHED:
      result += ">";
      break;
    case ArrowType.HOLLOW:
      result += "▷";
      break;
    case ArrowType.HOLLOW_CIRCLE:
      result += "○";
      break;
    case ArrowType.HOLLOW_SQUARE:
      result += "□";
      break;
    case ArrowType.HOLLOW_DIAMOND:
      result += "◇";
      break;
    case ArrowType.FILLED:
      result += "▶";
      break;
    case ArrowType.FILLED_CIRCLE:
      result += "●";
      break;
    case ArrowType.FILLED_SQUARE:
      result += "■";
      break;
    case ArrowType.FILLED_DIAMOND:
      result += "◆";
      break;
  }

  return result;
}
