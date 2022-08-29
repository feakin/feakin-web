import { dagreLayout } from "../../layout/dagre/dagre-layout";
import { SimpleRelation } from "../../layout/simple-relation";
import { Graph } from "../../model/graph";
import { FlowEdge, FlowNode } from "./parse/flow";
import { flowTranspiler } from "./parse/flow-transpiler";
import { Importer } from "../importer";

export class MermaidImporter extends Importer {
  constructor(content: string) {
    super(content);
  }

  override parse(): Graph {
    const flow = flowTranspiler(this.content);
    const relations = this.flowToDagre(flow.nodes, flow.edges);
    return dagreLayout(relations);
  }

  flowToDagre(nodes: { [p: string]: FlowNode }, edges: FlowEdge[]): SimpleRelation[] {
    const relations: SimpleRelation[] = [];
    edges.forEach(edge => {
      relations.push({
        source: { name: edge.start },
        target: { name: edge.end }
      });
    });

    return relations;
  }
}
