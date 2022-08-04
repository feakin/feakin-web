export interface MxFileRoot {
  mxfile: Mxfile;
}

export interface Mxfile {
  diagram: Diagram;
  attributes?: {
    host: string;
    modified: Date;
    agent: string;
    etag: string;
    version: string;
    type: string;
  };
}

export interface Diagram {
  _text: string;
  attributes?: {
    id: string;
    name: string;
  }
}


export interface MxGraph {
  mxGraphModel: MxGraphModel;
}

export interface MxGraphModel {
  root: RootNode;
  attributes?: {
    dx?: number;
    dy?: number;
    grid?: number;
    gridSize?: number;
    guides?: string;
    tooltips?: string;
    connect?: string;
    arrows?: string;
    fold?: string;
    page?: string;
    pageScale?: string;
    pageWidth?: string;
    pageHeight?: string;
    math?: string;
    shadow?: string;
  }
}

export interface RootNode {
  mxCell: MXCell[];
}

export interface MXCell {
  mxGeometry?: MXGeometry;
  attributes?: {
    id: string;
    style?: string;
    source?: string;
    target?: string;
    edge?: string;
    value?: string;
    vertex?: number;
    parent?: string;
    children?: MXCell[];
    connectable?: string;
  }
}

export interface MXGeometry {
  mxPoint?: MxPoint[];
  attributes?: {
    x?: number;
    y?: number;
    relative?: string;
    as?: string;
    width?: number;
    height?: number;
  }
}

export interface MxPoint {
  as: string;
  x?: string;
  y?: string;
}
