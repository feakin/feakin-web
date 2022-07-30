export interface FlowEdge {
  start: string,
  end: string,
  type: 'arrow_open' | 'arrow_point' | 'arrow_circle' | 'arrow_cross',
  text: string,
  stroke: 'normal' | 'thick' | 'dotted',
  length: number
}
