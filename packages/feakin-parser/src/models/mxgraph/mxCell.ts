// @ts-ignore
interface mxCell {
  id: string;
  value: any;
  // geometry: mxGeometry;
  style: string;
  vertex: boolean;
  edge: boolean;
  connectable: boolean;
  visible: boolean;
  collapsed: boolean;

  parent: mxCell;
  source: mxCell;
  target: mxCell;
  children: Array<mxCell>;
  edges: Array<mxCell>;
}
