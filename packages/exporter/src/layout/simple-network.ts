export interface SimpleElement {
  name: string;
  label?: string
}

export interface SimpleNetwork {
  source: SimpleElement;
  target?: SimpleElement;
}
