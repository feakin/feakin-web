import { CellStateStyle, MxArrowType } from "./cell-state-style";
import { defaultEdgeProperty, EdgeProperty, ElementProperty, NodeData } from "../../model/graph";
import { LineType } from "../../model/edge/decorator/line-type";
import { Arrowhead } from "../../model/edge/decorator/arrowhead";
import { LineDashStyle } from "../../model/edge/decorator/line-dash-style";

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

  static toEdgeStyle(stateStyle: CellStateStyle): EdgeProperty {
    const props: EdgeProperty = Object.assign( {
      fill: {
        color: stateStyle.fillColor,
        gradient: stateStyle.gradientColor,
        transparent: stateStyle.fillOpacity === 0,
        opacity: stateStyle.fillOpacity
      },
      decorator: {
        lineType: LineType.LINE,
        lineDashStyle: this.mxToLineStyle(stateStyle),
        startArrowhead: this.mxArrowToArrowhead(stateStyle.startArrow ?? 'none', stateStyle.startFill),
        endArrowhead: this.mxArrowToArrowhead(stateStyle.endArrow ?? 'none', stateStyle.startFill),
      },
      stroke: {
        color: stateStyle.strokeColor,
        width: parseFloat(<string>stateStyle.strokeWidth ?? "1"),
        opacity: parseFloat(<string>stateStyle.strokeOpacity ?? "1"),
      }
    });

    return props;
  }

  static mxToLineStyle(stateStyle: CellStateStyle): LineDashStyle {
    if (stateStyle.dashed) {
      switch (stateStyle.dashPattern) {
        // dashPattern: "1 3", is default draw.io magic numbers
        case "1 3":
          return LineDashStyle.DOT;
      }

      return LineDashStyle.DASH;
    }

    return LineDashStyle.SOLID
  }

  static mxArrowToArrowhead(mxArrow: MxArrowType, filled = false): Arrowhead {
    switch (mxArrow) {
      case "none":
        return Arrowhead.NONE;
      case "block":
        return Arrowhead.HOLLOW_DIAMOND;
      case "diamondThin":
      case "diamond":
        if (filled) {
          return Arrowhead.FILLED_DIAMOND;
        } else {
          return Arrowhead.HOLLOW_DIAMOND;
        }
      case "oval":
        if (filled) {
          return Arrowhead.FILLED_CIRCLE;
        } else {
          return Arrowhead.HOLLOW_CIRCLE;
        }
      default:
        return Arrowhead.NOTCHED;
    }
  }
}

