import { ElementProperty, Graph } from "../model/graph";

export class Importer implements StringParser {
  content: string;

  constructor(content: string) {
    this.content = content;
  }

  parse(): Graph {
    return {} as Graph;
  }

  // convert element properties
  transProp(source: any): ElementProperty {
    return {} as ElementProperty;
  }

}

export interface StringParser {
  parse(): Graph;
}
