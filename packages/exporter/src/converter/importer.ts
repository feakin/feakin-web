import { Graph } from "../model/graph";

export class Importer implements StringParser {
  content: string;

  constructor(content: string) {
    this.content = content;
  }

  parse(): Graph {
    return {} as Graph;
  }
}

export interface StringParser {
  parse(): Graph;
}
