export interface Label {
  name: string;
  label?: string
}

export interface SimpleRelation {
  source: Label;
  target?: Label;
}
