import { Point } from "./point";

export interface Label {
  name: string;
  label?: string
}

export interface BaseEdge {
  points: Point[]
}

export interface BaseNode extends Point {
  label?: string;
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
