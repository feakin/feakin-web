import { CellState } from "./cell-state";

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
    const prop = CellState.toEdgeStyle(CellState.fromString("endArrow=openAsync;startArrow=diamondThin;html=1;rounded=0;startFill=1;endFill=0;"));
    expect(prop.decorator).toEqual({
      endType: "notched",
      lineStyle: "solid",
      lineType: "line",
      startType: "filled-diamond"
    });
  });

  it('diamond thin arrow', function () {
    const prop = CellState.toEdgeStyle(CellState.fromString("endArrow=openAsync;startArrow=diamondThin;html=1;rounded=0;startFill=1;endFill=0;"));
    expect(prop.decorator).toEqual({
      endType: "notched",
      lineStyle: "solid",
      lineType: "line",
      startType: "filled-diamond"
    });
  });

  it('block arrow', function () {
    const prop =  CellState.toEdgeStyle(CellState.fromString("endArrow=block;startArrow=diamond;html=1;rounded=0;startFill=0;endFill=0;"));
    expect(prop.decorator).toEqual({
      endType: "hollow-diamond",
      lineStyle: "solid",
      lineType: "line",
      startType: "filled-diamond"
    });
  });
});
