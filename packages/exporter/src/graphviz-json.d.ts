export type Rectangle = [number, number, number, number]
export type Point = [number, number]
export type Pointlist = Point[]
export type Point3 = [number, number, number]
export type Color = string
export type Drawops = (
  | Ellipse
  | Polygon
  | Polyline
  | Bspline
  | Text
  | FontStyle
  | Drawcolor
  | Font
  | Style
  )[]

// An end point consists of a {\tt point} preceded by {\tt "e,"};
// a start point consists of a {\tt point} preceded by {\tt "s,"}. The
// optional components are separated by spaces.
export type Pos = string;

/**
 * JSON representation of a graph encoding xdot attributes
 */
export interface GraphvizJson {
  /**
   * The graph name
   */
  name: string
  /**
   * True if the graph is directed
   */
  directed: boolean
  /**
   * True if the graph is strict
   */
  strict: boolean
  /**
   * Number of subgraphs in the graph
   */
  _subgraph_cnt: number
  /**
   * The graph's subgraphs followed by the graph's nodes
   */
  objects?: NodeOrSubgraph[]
  edges?: Edge[]
  _draw_?: Drawops
  _ldraw_?: Drawops
  additionalProperties?: string

  [k: string]: unknown
}

export interface NodeOrSubgraph {
  _gvid: number
  /**
   * The node or subgraph name
   */
  name: string
  /**
   * index of a child subgraph
   */
  subgraphs?: number[]
  /**
   * index of a node in this subgraph
   */
  nodes?: number[]
  /**
   * index of an edge in this subgraph
   */
  edges?: number[]
  _draw_?: Drawops
  _ldraw_?: Drawops
  additionalProperties?: string
  pos?: Pos

  [k: string]: unknown
}

export interface Ellipse {
  op: string
  rect: Rectangle

  [k: string]: unknown
}

export interface Polygon {
  op: string
  points: Pointlist

  [k: string]: unknown
}

export interface Polyline {
  op: string
  points: Pointlist

  [k: string]: unknown
}

export interface Bspline {
  op: string
  points: Pointlist

  [k: string]: unknown
}

export interface Text {
  op: string
  pt: Point
  align: string
  text: string
  width: number

  [k: string]: unknown
}

export interface FontStyle {
  op: string
  fontchar: number

  [k: string]: unknown
}

export interface Drawcolor {
  op: string
  p0?: Point | Point3
  p1?: Point | Point3
  grad: "none" | "linear" | "radial"
  color?: Color
  stops?: Stop[]

  [k: string]: unknown
}

export interface Stop {
  frac: number
  color: Color

  [k: string]: unknown
}

export interface Font {
  op: string
  size: number
  face: string

  [k: string]: unknown
}

export interface Style {
  op: string
  style: string

  [k: string]: unknown
}

export interface Edge {
  _gvid: number
  /**
   * _gvid of tail node
   */
  tail: number
  /**
   * _gvid of tail head
   */
  head: number
  _draw_?: Drawops
  _ldraw_?: Drawops
  _hdraw_?: Drawops
  _tdraw_?: Drawops
  _hldraw_?: Drawops
  _tldraw_?: Drawops
  additionalProperties?: string

  pos?: Pos

  [k: string]: unknown
}
