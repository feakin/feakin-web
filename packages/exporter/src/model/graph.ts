import { Point } from "./geometry/point";
import { FillState } from "./state-style/fill-state";
import { StrokeState } from "./state-style/stroke-state";
import { EdgeType } from "./edge/edge-type";
import { FontState } from "./state-style/font-state";
import { ShapeType } from "./node/base/shape";

/**
 * Graph is a class that represents a graph.
 */

export interface Graph {
  nodes: Node[];
  edges: Edge[];
  prop?: GraphProperty;
  // sub graph
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
  fill?: FillState;
  stroke?: StrokeState;
  font?: FontState;
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
