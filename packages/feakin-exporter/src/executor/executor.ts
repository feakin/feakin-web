import { parseFlow } from "../source/mermaid-flow";
import { FlowEdge, FlowVertex } from "../source/flow";
import { BaseEdge, BaseNode, dagreLayout, DagreRelation } from "../layout/dagre-layout";

export interface IExecutor {
  execute(source: string): Promise<string>;
}

export class Executor implements IExecutor {
  flowToDagre(nodes: { [p: string]: FlowVertex }, edges: FlowEdge[]): DagreRelation[] {
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
    let flow = parseFlow(source);
    let relations = this.flowToDagre(flow.nodes, flow.edges);
    const layout = dagreLayout(relations);
    this.toMermaid(layout);

    return Promise.resolve("");
  }

  private toMermaid(layout: { nodes: BaseNode[]; edges: BaseEdge[] }) {

  }
}
