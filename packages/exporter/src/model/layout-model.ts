import { Point } from "./point";

export interface Label {
  name: string;
  label?: string
}

export type SourceElement = Label
export type TargetElement = Label

export interface DagreRelation {
  source: SourceElement;
  target?: TargetElement;
}

// todo: merge to elements;
export interface BaseEdge {
  points: Point[]
}

export interface Valued {
  label?: string;
}

export interface BaseNode extends Point, Valued {
  width: number;
  height: number;
  padding?: number | undefined;
  paddingX?: number | undefined;
  paddingY?: number | undefined;
  rx?: number | undefined;
  ry?: number | undefined;
}

export interface LayoutOutput {
  nodes: BaseNode[];
  edges: BaseEdge[];
}
