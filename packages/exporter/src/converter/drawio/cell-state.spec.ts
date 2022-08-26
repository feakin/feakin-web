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
});
