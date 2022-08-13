import { parseFlow } from "../source/mermaid-flow";
import { FlowEdge, FlowNode } from "../source/flow";
import { dagreLayout } from "../layout/dagre-layout";
import { DagreRelation } from "../layout/dagre-relation";
import { Edge, Graph, Node } from "../model/graph";

export interface IExecutor {
  execute(source: string): Promise<string>;
}

export class Executor implements IExecutor {
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

  execute(source: string): Promise<string> {
    const layout = this.sourceToDagre(source);
    this.toMermaid(layout);

    return Promise.resolve("");
  }

  sourceToDagre(source: string): Graph {
    const flow = parseFlow(source);
    const relations = this.flowToDagre(flow.nodes, flow.edges);
    return dagreLayout(relations);
  }

  private toMermaid(layout: { nodes: Node[]; edges: Edge[] }) {
    //
  }
}
