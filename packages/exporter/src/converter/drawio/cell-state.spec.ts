import { CellState } from "./cell-state";
import { CellStateStyle } from "./cell-state-style";

describe("CellStateParser", () => {
  it('from string ', function () {
    const parseStyle = CellState.fromString("endArrow=classic;html=1;exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=1;entryY=0;entryDx=0;entryDy=0;curved=1;");
    expect(parseStyle["curved"]).toBeTruthy();
  });

  it('to string', function () {
    const string = CellState.toString({
      shape: "triangle",
    });
    expect(string).toBe("shape=triangle;");
  });

  it('dash arrow', function () {
    const prop = CellState.toEdgeStyle(CellState.fromString("endArrow=none;dashed=1;html=1;dashPattern=1 3;strokeWidth=2;rounded=0;"));
    expect(prop.decorator).toEqual({
      endArrowhead: "none",
      startArrowhead: "none",
      lineDashStyle: "dot",
      lineType: "straight",
    });
  });

  it('diamond thin arrow', function () {
    const prop = CellState.toEdgeStyle(CellState.fromString("endArrow=openAsync;startArrow=diamondThin;html=1;rounded=0;startFill=1;endFill=0;"));
    expect(prop.decorator).toEqual({
      startArrowhead: "filled-diamond",
      endArrowhead: "notched",
      lineDashStyle: "solid",
      lineType: "straight"
    });
  });

  it('block arrow', function () {
    const prop =  CellState.toEdgeStyle(CellState.fromString("endArrow=block;startArrow=diamond;html=1;rounded=0;startFill=0;endFill=0;"));
    expect(prop.decorator).toEqual({
      lineDashStyle: "solid",
      lineType: "straight",
      startArrowhead: "filled-diamond",
      endArrowhead: "hollow"
    });
  });

  it('stroke width', function () {
    const prop =  CellState.toEdgeStyle(CellState.fromString("strokeWidth=2;html=1;rounded=0;startFill=0;endFill=0;"));
    expect(prop.stroke?.width).toEqual(2);
  });

  it('stroke color', function () {
    const prop =  CellState.toEdgeStyle(CellState.fromString("text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;dashed=1;"));
    expect(prop.stroke?.color).toEqual("none");
  });

  it('to cell state', function () {
    const state: CellStateStyle = CellState.toCellStateStyle({});
    expect(state).toEqual({
      "curved": false,
      "dashPattern": "3 3",
      "dashed": false,
      "endArrow": "none",
      "endFill": false,
      "fillColor": "#ffffff",
      "fillOpacity": undefined,
      "gradientColor": undefined,
      "startArrow": "none",
      "startFill": false,
      "strokeColor": "#000000",
      "strokeOpacity": "false",
      "strokeWidth": "1"
    });
  });
});
