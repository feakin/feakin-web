import { ElementProperty, Graph } from "../model/graph";

export class Importer implements StringParser {
  content: string;
  isPromise = false;

  constructor(content: string) {
    this.content = content;
  }

  parse(): Graph {
    return {} as Graph;
  }

  async parsePromise(): Promise<Graph> {
    return new Promise<Graph>((resolve, reject) => {
      resolve({} as Graph);
    });
  }

  // convert element properties
  transProp(source: any): ElementProperty {
    return {} as ElementProperty;
  }

}

export interface StringParser {
  parse(): Graph;
}
