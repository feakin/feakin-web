import { CellStateStyle, MxArrowType } from "./cell-state-style";
import { ElementProperty, NodeData } from "../../model/graph";
import { LineType } from "../../model/edge/decorator/line-type";
import { ArrowType } from "../../model/edge/decorator/arrow-type";
import { LineStyle } from "../../model/edge/decorator/line-style";

export class CellState implements CellStateStyle {
  static fromString(style: string): CellStateStyle {
    const styles = style.split(";");
    const parsed: any = {};

    styles.forEach((style: string) => {
        const [key, value] = style.split("=");
        parsed[key] = value;
      }
    );

    return parsed;
  }

  static toString(stateStyle: CellStateStyle | NodeData): string {
    const styles = Object.keys(stateStyle)
      .map((key: string) => {
          return `${ key }=${ (stateStyle as any)[key] };`;
        }
      );

    return styles.join("");
  }

  static toEdgeStyle(stateStyle: CellStateStyle): ElementProperty {
    let props: ElementProperty = {
      fill: {
        color: stateStyle.fillColor,
        gradient: stateStyle.gradientColor,
        transparent: stateStyle.fillOpacity === 0,
        opacity: stateStyle.fillOpacity
      },
      decorator: {
        lineType: LineType.LINE,
        lineStyle: LineStyle.SOLID,
        startType: this.mxArrowToArrowType(stateStyle.startArrow ?? 'none', stateStyle.startFill),
        endType: this.mxArrowToArrowType(stateStyle.endArrow ?? 'none', stateStyle.startFill),
      }
    };

    return props;
  }

  static mxArrowToArrowType(mxArrow: MxArrowType, filled = false): ArrowType {
    switch (mxArrow) {
      case "none":
        return ArrowType.NONE;
      case "block":
        return ArrowType.HOLLOW_DIAMOND;
      case "diamondThin":
      case "diamond":
        if (filled) {
          return ArrowType.FILLED_DIAMOND;
        } else {
          return ArrowType.HOLLOW_DIAMOND;
        }
      case "oval":
        if (filled) {
          return ArrowType.FILLED_CIRCLE;
        } else {
          return ArrowType.HOLLOW_CIRCLE;
        }
      default:
        return ArrowType.NOTCHED;
    }
  }
}

