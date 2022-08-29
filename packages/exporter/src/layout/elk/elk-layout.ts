import { LayoutBase, LayoutConverter } from "../../model/layout/layout";
import { Graph } from "../../model/graph";

// todo: ELK is to big for a layout
export class ElkLayout extends LayoutBase implements LayoutConverter<any, any[]> {
  instance: any;

  layoutOptions = {
    'elk.algorithm': 'layered'
  }

  constructor() {
    super();
    this.initInstance(this.layoutOptions);
  }

  layout(data: any[]): Graph {
    return {} as Graph;
  }

  preLayout(intermedia?: any[]): Graph {
    return {} as Graph;
  }

  doLayout(intermedia?: any[]): Graph {
    return {} as Graph;
  }

  initInstance(options: any): void {
    this.instance = {  };
  }

  postLayout(graph: Graph): Graph {
    return {} as Graph;
  }
}
