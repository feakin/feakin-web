import { Point } from "./point";

export type Graph = Elements;

export interface Elements {
  nodes: Node[];
  edges: Edge[];
}

export type Position = Point;

interface Element {
  data: NodeData | EdgeData;
  position?: Position | undefined;
  css?: any | undefined;
}

interface ElementProperty {
}

export interface Node extends Element, ElementProperty {
  data: NodeData;
}

export interface Edge extends Element, ElementProperty {
  data: EdgeData;
}

export interface NodeData extends ElementData {
  id?: string | undefined;
  parent?: string | undefined;
  children?: string[];

  [key: string]: any;
}

export interface EdgeData extends ElementData {
  id?: string | undefined;
  source: string;
  target: string;

  [key: string]: any;
}

interface ElementData {
  id?: string | undefined;
  position?: Position | undefined;
}
