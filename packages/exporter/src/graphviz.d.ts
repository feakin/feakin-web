export interface GraphvizOutput {
  name: string
  directed: boolean
  strict: boolean
  _draw_: Draw[]
  bb: string
  xdotversion: string
  _subgraph_cnt: number
  objects: Node[]
  edges: Edge[]
}

export interface Draw {
  op: string
  grad?: string
  color?: string
  points?: number[][]
}

export interface Node {
  _gvid: number
  name: string
  _draw_: Draw2[]
  _ldraw_: Ldraw[]
  height: string
  label: string
  pos: string
  width: string
}

export interface Draw2 {
  op: string
  grad?: string
  color?: string
  rect?: number[]
}

export interface Ldraw {
  op: string
  size?: number
  face?: string
  grad?: string
  color?: string
  pt?: number[]
  align?: string
  width?: number
  text?: string
}

export interface Edge {
  _gvid: number
  tail: number
  head: number
  _draw_: Draw3[]
  _hdraw_: Hdraw[]
  pos: string
  color?: string
}

export interface Draw3 {
  op: string
  grad?: string
  color?: string
  points?: number[][]
}

export interface Hdraw {
  op: string
  style?: string
  grad?: string
  color?: string
  points?: number[][]
}
