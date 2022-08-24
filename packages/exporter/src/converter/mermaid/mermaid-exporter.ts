import { Exporter } from "../exporter";
import { Graph } from "../../model/graph";

export class MermaidExporter extends Exporter<any >{
  constructor(graph: Graph) {
    super(graph);
  }
}
