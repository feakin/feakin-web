import { Node } from './graph';

export interface DataExt<D> {
  data(): D;
}

export class NodeExt implements Node, DataExt<Node> {
  id: string;
  label: string;

  constructor(id: string, label: string) {
    this.id = id;
    this.label = label;
  }

  data(): Node {
    return this;
  }
}
