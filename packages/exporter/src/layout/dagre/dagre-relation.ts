export interface Label {
  name: string;
  label?: string
}

export type SourceElement = Label
export type TargetElement = Label

export interface DagreRelation {
  source: SourceElement;
  target?: TargetElement;
}
