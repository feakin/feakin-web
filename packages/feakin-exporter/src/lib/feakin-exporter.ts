import * as dagre from 'dagre'
import { Point } from "../model/geometry/point";

export function feakinExporter(): string {
  return 'feakin-exporter';
}

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

export function fromDagre(node: dagre.Node<string>): BaseNode {
  return node;
}
