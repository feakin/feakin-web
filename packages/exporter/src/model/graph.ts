import { Point } from "./geometry/point";
import { FillStyleProp } from "./prop/fill-style-prop";
import { StrokeStyleProp } from "./prop/stroke-style-prop";
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
  width?: number;
  height?: number;
  position?: Point;
  css?: any | undefined;
}

export interface ElementProperty {
  color?: string;
  fill?: FillStyleProp;
  stroke?: StrokeStyleProp;
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
  prop?: ElementProperty;
}

export interface NodeData {
  // In excalidraw, drawio, the graph hierarchy is a tree, but when stored data, it's flat, so we keep in some rules.
  parentId?: string | undefined;
  children?: string[];
  curved?: boolean;
  shape?: ShapeType;

  [key: string]: any;
}

/**
 * Edge (also called links or lines) is a class that represents an edge in a graph.
 */
export interface Edge {
  id: string;
  label?: string;
  points: Point[];

  // like beziere curve need a cp
  controlPoints?: Point[];

  data?: EdgeData;
  prop?: ElementProperty;
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
