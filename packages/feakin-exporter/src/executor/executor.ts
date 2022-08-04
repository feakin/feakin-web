import { parseFlow } from "../source/mermaid-flow";

export interface IExecutor {
  execute(source: string): Promise<string>;
}

export class Executor implements IExecutor {
  execute(source: string): Promise<string> {
    let flow = parseFlow(source);
    console.log(flow);

    return Promise.resolve("");
  }
}

