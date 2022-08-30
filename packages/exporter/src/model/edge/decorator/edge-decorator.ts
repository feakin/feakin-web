import { Arrowhead } from "./arrowhead";
import { LineType } from "./line-type";
import { LineStyle } from "./line-style";

export const defaultEdgeDecorator: EdgeDecorator = {
  lineType: LineType.LINE,
  lineStyle: LineStyle.SOLID,
  endArrowhead: Arrowhead.NONE,
  startArrowhead: Arrowhead.NONE,
}

/**
 * The edge decorator is used to specify the style of the line and arrowheads
 */
export interface EdgeDecorator {
  lineStyle: LineStyle;
  lineType: LineType;
  startArrowhead: Arrowhead;
  endArrowhead: Arrowhead;
}

/**
 * this function is to make clearly about each type arrow and line for understand, especially for the test.
 */
export function edgeDecoratorForTest(edgeDecorator: EdgeDecorator): string {
  let result = "";
  switch (edgeDecorator.startArrowhead) {
    case Arrowhead.NONE:
      result += "";
      break;
    case Arrowhead.NOTCHED:
      result += "<";
      break;
    case Arrowhead.HOLLOW:
      result += "◁";
      break;
    case Arrowhead.HOLLOW_CIRCLE:
      result += "○";
      break;
    case Arrowhead.HOLLOW_SQUARE:
      result += "□";
      break;
    case Arrowhead.HOLLOW_DIAMOND:
      result += "◇";
      break;
    case Arrowhead.FILLED:
      result += "◀";
      break;
    case Arrowhead.FILLED_CIRCLE:
      result += "●";
      break;
    case Arrowhead.FILLED_SQUARE:
      result += "■";
      break;
    case Arrowhead.FILLED_DIAMOND:
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
    case LineStyle.DOT:
      result += ".".repeat(lineRepeat);
      break;
    default:
      result += " ".repeat(lineRepeat);
  }

  switch (edgeDecorator.endArrowhead) {
    case Arrowhead.NONE:
      result += "";
      break;
    case Arrowhead.NOTCHED:
      result += ">";
      break;
    case Arrowhead.HOLLOW:
      result += "▷";
      break;
    case Arrowhead.HOLLOW_CIRCLE:
      result += "○";
      break;
    case Arrowhead.HOLLOW_SQUARE:
      result += "□";
      break;
    case Arrowhead.HOLLOW_DIAMOND:
      result += "◇";
      break;
    case Arrowhead.FILLED:
      result += "▶";
      break;
    case Arrowhead.FILLED_CIRCLE:
      result += "●";
      break;
    case Arrowhead.FILLED_SQUARE:
      result += "■";
      break;
    case Arrowhead.FILLED_DIAMOND:
      result += "◆";
      break;
  }

  return result;
}