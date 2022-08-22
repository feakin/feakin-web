/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 * Updated to ES9 syntax by David Morrissey 2021
 * Type definitions from the typed-mxgraph project
 */

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
    connect?: boolean;
    arrows?: string;
    fold?: string;
    page?: string;
    pageScale?: number;
    pageWidth?: number | string;
    pageHeight?: number | string;
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
    label?: string;
    style?: string;
    /**
     * Once cell is an edge, this is the id of the source cell.
     */
    source?: string;
    /**
     * Once cell is an edge, this is the id of the target cell.
     */
    target?: string;
    /**
     * Specifies whether the cell is an edge. Default is false.
     */
    edge?: boolean;
    value?: string;
    /**
     * Specifies whether the cell is a vertex. Default is false.
     */
    vertex?: boolean;
    parent?: string;
    children?: MXCell[];
    /**
     * Specifies whether the cell is visible. Default is true.
     */
    visible?: boolean;
    /**
     * Specifies whether the cell is connectable. Default is true.
     */
    connectable?: boolean;
  }
}

export interface MXGeometry {
  mxPoint?: MxPoint[];
  /**
   * Array of {@link Point} which specifies the control points along the edge.
   * These points are the intermediate points on the edge, for the endpoints
   * use {@link targetPoint} and {@link sourcePoint} or set the terminals of the edge to
   * a non-null value. Default is null.
   */
  Array?: MXGeometry;
  attributes?: {
    x?: number;
    y?: number;
    /**
     * Specifies if the coordinates in the geometry are to be interpreted as
     * relative coordinates. For edges, this is used to define the location of
     * the edge label relative to the edge as rendered on the display. For
     * vertices, this specifies the relative location inside the bounds of the
     * parent cell.
     *
     * If this is false, then the coordinates are relative to the origin of the
     * parent cell or, for edges, the edge label position is relative to the
     * center of the edge as rendered on screen.
     *
     * Default is false.
     */
    relative?: boolean;
    as?: string;
    width?: number;
    height?: number;
    offset?: MxPoint[];
  }
}

export interface MxPoint {
  attributes?: {
    x?: string;
    y?: string;
  }
}


