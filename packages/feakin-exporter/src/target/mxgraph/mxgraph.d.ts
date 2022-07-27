export interface MxGraph {
  mxGraphModel: MxGraphModel;
}

export interface MxGraphModel {
  attributes: {
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
  root: RootNode;
}

export interface RootNode {
  mxCell: MXCell[];
}

export interface MXCell {
  attributes: {
    id: string;
    parent?: string;
    style?: string;
    source?: string;
    target?: string;
    edge?: string;
    value?: string;
    vertex?: string;
    connectable?: string;
  }
  mxGeometry?: MXGeometry;
}

export interface MXGeometry {
  mxPoint?: MxPoint[];
  attributes: {
    x?: string;
    y?: string;
    relative?: string;
    as: string;
    width?: string;
    height?: string;
  }
}

export interface MxPoint {
  as: string;
  x?: string;
  y?: string;
}
