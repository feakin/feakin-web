import { dagreLayout } from "../../layout/dagre-layout";
import { DagreRelation } from "../../layout/dagre-relation";
import { Graph } from "../../model/graph";
import { FlowEdge, FlowNode } from "./flow";
import { parseFlow } from "./mermaid-flow";

export class DargeFlowConverter {
  // todo: change to strategy;
  flowToDagre(nodes: { [p: string]: FlowNode }, edges: FlowEdge[]): DagreRelation[] {
    const relations: DagreRelation[] = [];
    edges.forEach(edge => {
      relations.push({
        source: { name: edge.start },
        target: { name: edge.end }
      });
    });

    return relations;
  }

  sourceToDagre(source: string): Graph {
    const flow = parseFlow(source);
    const relations = this.flowToDagre(flow.nodes, flow.edges);
    return dagreLayout(relations);
  }
}
