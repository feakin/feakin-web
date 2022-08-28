import { Point } from "./geometry/point";
import { FillProp } from "./prop/fill-prop";
import { StrokeProp } from "./prop/stroke-prop";
import { EdgeType } from "./edge/edge-type";
import { FontProps } from "./prop/font-props";
import { ShapeType } from "./node/base/shape-type";

/**
 * Graph is a class that represents a graph.
 */

export interface Graph {
  nodes: Node[];
  edges: Edge[];
  props?: GraphProperty;
  subgraphs?: Graph[];
}

export type Position = Point;

interface GraphProperty extends ElementProperty {
  data?: NodeData | EdgeData;
  position?: Position | undefined;
  css?: any | undefined;
}

export interface ElementProperty {
  width?: number;
  height?: number;

  color?: string;
  position?: Position | undefined;
  fill?: FillProp;
  stroke?: StrokeProp;
  font?: FontProps;
}

/**
 * Node (Vertex) is a class that represents a node in a graph.
 */
export interface Node extends ElementProperty {
  id: string;
  label: string;
  x?: number;
  y?: number;
  subgraph?: boolean;
  data?: NodeData;
}

export interface NodeData {
  /**
   * In excalidraw, drawio, the graph hierarchy is a tree, but when stored data, it's flat, so we keep in some rules.
   */
  parentId?: string | undefined;
  children?: string[];
  curved?: boolean;
  shape?: ShapeType;

  [key: string]: any;
}

/**
 * Edge (also called links or lines) is a class that represents an edge in a graph.
 */
export interface Edge extends ElementProperty {
  id: string;
  label?: string;
  points: Point[];
  controlPoints?: Point[];
  data?: EdgeData;
}

export interface EdgeData {
  parentId?: string;

  source: string;
  sourceId?: string;
  target: string;
  targetId?: string;
  type?: EdgeType;

  [key: string]: any;
}
