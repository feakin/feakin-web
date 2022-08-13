import { parseFlow } from "../source/mermaid-flow";
import { FlowEdge, FlowNode } from "../source/flow";
import { dagreLayout } from "../layout/dagre-layout";
import { DagreRelation } from "../layout/dagre-relation";
import { Graph } from "../model/graph";

export class Executor {
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
