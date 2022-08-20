import { MXCell, MxGraph } from "./mxgraph";
import { Edge, Graph, Node } from "../../model/graph";
import { CellStateStyle } from "./cell-state-style";
import { Converter, FeakinConverter } from "../converter";

export class DrawioConverter extends Converter implements FeakinConverter {
  private mxCells: MXCell[];

  constructor(graph: MxGraph) {
    super(graph);
    this.mxCells = this.graph.mxGraphModel.root.mxCell;
  }

  convert(): Graph {
    let filtered: Graph = {
      nodes: [],
      edges: [],
    };

    this.mxCells.forEach((cell: MXCell) => {
        if (cell.attributes?.source && cell.attributes?.target) {
          filtered.edges.push(this.convertRelation(cell));
        } else if (cell.attributes?.value) {
          filtered.nodes.push(this.convertNode(cell));
        }
      }
    );

    return filtered;
  }

  parseStyle(style: string): CellStateStyle {
    const styles = style.split(";");
    const parsed: any = {};

    styles.forEach((style: string) => {
        const [key, value] = style.split("=");
        parsed[key] = value;
      }
    );

    return parsed;
  }

  private convertRelation(cell: MXCell): Edge {
    const attrs = cell.attributes!;

    return {
      id: attrs.id,
      label: attrs.value,
      data: {
        source: attrs.source!,
        target: attrs.target!,
      }
    };
  }

  private convertNode(cell: MXCell): Node {
    const attrs = cell.attributes!;

    return {
      id: attrs.id,
      label: attrs.value,
    };
  }
}
