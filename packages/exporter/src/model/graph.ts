import { Point } from "./geometry/point";
import { FillProp } from "./prop/fill-prop";
import { StrokeProp } from "./prop/stroke-prop";
import { LineStyle } from "./edge/decorator/line-style";
import { FontProps } from "./prop/font-props";
import { ShapeType } from "./node/base/shape-type";
import { defaultEdgeDecorator, EdgeDecorator } from "./edge/decorator/edge-decorator";

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

// ElementProperty are used to define the graphical representation of edges and edges.
export interface ElementProperty {
  color?: string;
  fill?: FillProp;
  stroke?: StrokeProp;
  font?: FontProps;
}

/**
 * @type {EdgeProperty} (akk. EdgeStyle) are used to define the graphical representation of edges.
 * @type {EdgeDecorator} is used to specify the style of the line and arrowheads.
 */
export interface EdgeProperty extends ElementProperty {
  decorator?: EdgeDecorator;
}

export const defaultEdgeProperty: EdgeProperty = {
  color: "black",
  fill: {
    color: "#000000"
  },
  stroke: {
    color: "#000000",
    width: 1,
    opacity: 1
  },
  decorator: defaultEdgeDecorator
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

  props?: EdgeProperty;
}

export interface EdgeData {
  parentId?: string;

  source: string;
  sourceId?: string;
  target: string;
  targetId?: string;
  type?: LineStyle;

  [key: string]: any;
}
