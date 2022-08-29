import { LayoutBase, LayoutConverter } from "../../model/layout/layout";
import { graphlib } from "dagre";
import { Graph } from "../../model/graph";
import { runLayout } from "./dagre-layout";

export class DagreLayoutConverter extends LayoutBase implements LayoutConverter<graphlib.Graph, any> {
  instance!: graphlib.Graph;
  private graph!: Graph;

  constructor() {
    super();
    this.graph = {
      nodes: [],
      edges: [],
      props: {}
    };
  }

  initInstance(options: any): graphlib.Graph {
    const graph = new graphlib.Graph({
      multigraph: true,
      compound: true,
    }).setGraph({
      rankdir: options.rankdir
    });

    graph.setDefaultEdgeLabel(() => ({}));
    return graph;
  }

  preLayout(): Graph {
    return this.graph;
  }

  doLayout(): Graph {
    return runLayout(this.instance);
  }

  postLayout(graph: Graph): Graph {
    return this.graph;
  }

  layout(data: any[]): Graph {
    return this.doLayout();
  }
}
