import { Graph } from "../model/graph";

export class Importer {
  content: string;
  isPromise = false;

  constructor(content: string) {
    this.content = content;
  }

  parse(): Graph {
    return {} as Graph;
  }

  /**
   * support for wasm, like Graphviz
    */
  async parsePromise(): Promise<Graph> {
    return new Promise<Graph>((resolve, reject) => {
      resolve({} as Graph);
    });
  }
}
