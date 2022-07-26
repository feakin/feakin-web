export interface MXGraphModel {
  root: Root;
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
  value?: string;
  style?: string;
  vertex?: string;
}

export interface MXGeometry {
  x: string;
  y: string;
  width: string;
  height: string;
  as: string;
}

