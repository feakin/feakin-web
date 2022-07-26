export interface MxGraphModel {
  root: RootNode;
  dx: string;
  dy: string;
  grid: string;
  gridSize: string;
  guides: string;
  tooltips: string;
  connect: string;
  arrows: string;
  fold: string;
  page: string;
  pageScale: string;
  pageWidth: string;
  pageHeight: string;
  math: string;
  shadow: string;
}

export interface Root {
  mxCell: MXCell[];
}

export interface MXCell {
  id: string;
  parent?: string;
  mxGeometry?: MXGeometry;
  style?: string;
  source?: string;
  target?: string;
  edge?: string;
  value?: string;
  vertex?: string;
  connectable?: string;
}

export interface MXGeometry {
  mxPoint?: MxPoint[];
  x?: string;
  y?: string;
  relative?: string;
  as: string;
  width?: string;
  height?: string;
}

export interface MxPoint {
  as: string;
  x?: string;
  y?: string;
}
