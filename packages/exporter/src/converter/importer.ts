import { Graph } from "../model/graph";

export class Importer {
  private content: string;

  constructor(content: string) {
    this.content = content;
  }

  parse(): Graph {
    return {} as Graph;
  }
}
