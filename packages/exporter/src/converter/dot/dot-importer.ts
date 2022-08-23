import parse, { Graph as DotGraph } from "dotparser";

import { Importer } from "../importer";
import { Node, Edge, Graph } from "../../model/graph";

export class DotImporter extends Importer {
  constructor(content: string) {
    super(content);
  }

  // Todo: a refs can be: https://github.com/magjac/graphviz-visual-editor/blob/master/src/dot.js
  override parse(): Graph {
    const graphs: DotGraph[] = parse(this.content);
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    graphs.forEach(graph => {
      graph.children.forEach(child => {
        switch (child.type) {
          case "attr_stmt":
            break;
          case "edge_stmt":
            break;
          case "node_stmt":
            break;
          case "subgraph":
            break;
        }
      })
    })

    return { nodes, edges };
  }
}
