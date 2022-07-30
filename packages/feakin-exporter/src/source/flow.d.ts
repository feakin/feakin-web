export interface FlowEdge {
  start: string,
  end: string,
  type?: 'arrow_open' | 'arrow_point' | 'arrow_circle' | 'arrow_cross',
  text: string,
  stroke?: 'normal' | 'thick' | 'dotted',
  length?: number
}

// Geometry ??
export interface FlowVertex {
  id: string,
  domId: string,
  styles: string[],
  classes: string[],
  text?: string,
  dir?: string,
  type?: string | 'square',
  props?: object
}
