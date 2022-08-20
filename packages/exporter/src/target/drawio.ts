import { FeakinExporter } from './exporter';
import { Graph } from "../model/graph";

export class DrawioExporter implements FeakinExporter {
  graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  export(): any {
    return '';
  }

  footer(): string {
    return '';
  }

  header(): string {
    return '';
  }
}
