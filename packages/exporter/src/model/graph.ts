import { Point } from "./geometry/point";
import { FillState } from "./state-style/fill-state";
import { StrokeState } from "./state-style/stroke-state";
import { EdgeType } from "./edge/edge-type";
import { FontState } from "./state-style/font-state";

/**
 * Graph is a class that represents a graph.
 */
export type Graph = Layer;

export interface Layer {
  nodes: Node[];
  edges: Edge[];
  props?: Element;
}

export type Position = Point;

interface Element extends ElementProperty {
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
  data?: NodeData;
}

export interface NodeData {
  parent?: string | undefined;
  children?: string[];
  curved?: boolean;

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
  source: string;
  sourceId?: string;
  target: string;
  targetId?: string;
  type?: EdgeType;

  [key: string]: any;
}
