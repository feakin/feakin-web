import { Graph } from "../model/graph";

export interface FeakinExporter {
  graph: Graph;

  export(): any;

  header(): string;

  footer(): string;
}
