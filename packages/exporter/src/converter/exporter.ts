import { Graph } from "../model/graph";

export class Exporter<K> {
  data: K | undefined;

  export(graph: Graph): K {
    return {} as K;
  }

  toString(): string {
    return JSON.stringify(this.data, null, 2);
  }
}
