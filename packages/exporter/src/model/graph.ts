import { Point } from "./geometry/point";
import { FillProp } from "./prop/fill-prop";
import { StrokeProp } from "./prop/stroke-prop";
import { LineType } from "./edge/decorator/line-type";
import { FontProps } from "./prop/font-props";
import { ShapeType } from "./node/base/shape-type";
import { EdgeDecorator } from "./edge/decorator/edge-decorator";

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
  fill?: FillProp;
  stroke?: StrokeProp;
  font?: FontProps;
  decorator?: EdgeDecorator;
}

/**
 * Node (Vertex) is a class that represents a node in a graph.
 */
export interface Node {
  id: string;
  label: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  subgraph?: boolean;

  data?: NodeData;
  props?: ElementProperty;
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

  width?: number;
  height?: number;

  // like beziere curve need a cp
  controlPoints?: Point[];

  data?: EdgeData;

  props?: ElementProperty;
}

export interface EdgeData {
  parentId?: string;

  source: string;
  sourceId?: string;
  target: string;
  targetId?: string;
  type?: LineType;

  [key: string]: any;
}
