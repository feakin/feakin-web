import { CellStateStyle, MxArrowType } from "./cell-state-style";
import { defaultEdgeProperty, EdgeProperty, ElementProperty, NodeData } from "../../model/graph";
import { LineStyle } from "../../model/edge/decorator/line-style";
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

  static toCellStateStyle(origin: EdgeProperty) : CellStateStyle {
    const prop = Object.assign({}, defaultEdgeProperty, origin);

    const state: CellStateStyle = {
      fillColor: prop.fill!.color,
      gradientColor: prop.fill!.gradient,
      fillOpacity: prop.fill!.opacity,
      strokeColor: prop.stroke!.color,
      strokeWidth: prop.stroke!.width.toString(),
      strokeOpacity: "false",
      dashed: prop.decorator!.lineDashStyle !== LineDashStyle.SOLID,
      dashPattern: prop.decorator!.lineDashStyle === LineDashStyle.DOT ? "1 3" : "3 3",
      curved: prop.decorator!.lineType === LineStyle.CURVED,
      startArrow: this.arrowheadToMxArrow(prop.decorator!.startArrowhead),
      endArrow: this.arrowheadToMxArrow(prop.decorator!.endArrowhead),
      startFill: prop.decorator!.startArrowhead !== Arrowhead.NONE,
      endFill: prop.decorator!.endArrowhead !== Arrowhead.NONE,
    };

    return state;
  }

  static toEdgeStyle(stateStyle: CellStateStyle): EdgeProperty {
    const props: EdgeProperty = Object.assign( {
      fill: {
        color: stateStyle.fillColor == "none" ? "#fff" : stateStyle.fillColor,
        gradient: stateStyle.gradientColor,
        transparent: stateStyle.fillOpacity === 0,
        opacity: stateStyle.fillOpacity
      },
      decorator: {
        lineType: this.mxToLineType(stateStyle),
        lineDashStyle: this.mxToLineStyle(stateStyle),
        startArrowhead: this.mxArrowToArrowhead(stateStyle.startArrow ?? 'none', stateStyle.startFill),
        endArrowhead: this.mxArrowToArrowhead(stateStyle.endArrow ?? 'none', stateStyle.startFill),
      },
      stroke: {
        color: stateStyle.strokeColor,
        width: stateStyle.strokeColor == "none" ? 0 : parseFloat(<string>stateStyle.strokeWidth ?? "1"),
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
      case "classic":
      case "classicThin":
        return Arrowhead.NOTCHED;
      case "block":
        return Arrowhead.HOLLOW;
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

  private static mxToLineType(stateStyle: CellStateStyle) : LineStyle {
    if (stateStyle.curved) {
      return LineStyle.CURVED;
    }

    return LineStyle.STRAIGHT;
  }

  private static arrowheadToMxArrow(startArrowhead: Arrowhead) {
    switch (startArrowhead) {
      case Arrowhead.NONE:
        return "none";
      case Arrowhead.NOTCHED:
        return "classic";
      case Arrowhead.HOLLOW:
        return "block";
      case Arrowhead.FILLED_DIAMOND:
      case Arrowhead.HOLLOW_DIAMOND:
        return "diamond";
      case Arrowhead.FILLED_CIRCLE:
      case Arrowhead.HOLLOW_CIRCLE:
        return "oval";
      default:
        return "none";
    }
  }
}

