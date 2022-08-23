import { Point } from "./geometry/point";
import { FillState } from "./state-style/fill-state";
import { StrokeState } from "./state-style/stroke-state";
import { EdgeType } from "./edge/edge-type";
import { FontState } from "./state-style/font-state";

/**
 * Graph is a class that represents a graph.
 */
export type Graph = Layers;

export interface Layers {
  nodes: Node[];
  edges: Edge[];
  props?: Element;
}

export type Position = Point;

interface Element extends ElementProperty{
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
 * Node is the fundamental unit of which graphs are formed: an undirected graph consists of a set of vertices and
 * a set of edges (unordered pairs of vertices), while a directed graph consists of a set of vertices and a set of
 * arcs (ordered pairs of vertices). In a diagram of a graph, a vertex is usually represented by a circle with a label,
 * and an edge is represented by a line or arrow extending from one vertex to another.
 */
export interface Node extends ElementProperty {
  id: string;
  // todo: add count for label position ?
  label: string | undefined;
  x?: number;
  y?: number;
  data?: NodeData;
}

/**
 * Edge (also called links or lines) is a class that represents an edge in a graph.
 * An edge is (together with vertices) one of the two basic units out of which graphs are constructed.
 * Each edge has two (or in hypergraphs, more) vertices to which it is attached, called its endpoints.
 * Edges may be directed or undirected; undirected edges are also called lines and directed edges are also called
 * arcs or arrows. In an undirected simple graph, an edge may be represented as the set of its vertices, and in a
 * directed simple graph it may be represented as an ordered pair of its vertices. An edge that connects
 * vertices x and y is sometimes written xy.
 */
export interface Edge extends ElementProperty {
  id: string;
  label?: string;
  points: Point[];
  controlPoints?: Point[];
  data?: EdgeData;
}

export interface NodeData {
  parent?: string | undefined;
  children?: string[];
  curved?: boolean;

  [key: string]: any;
}

export interface EdgeData {
  source: string;
  sourceId?: string;
  target: string;
  targetId?: string;
  type?: EdgeType;

  [key: string]: any;
}

