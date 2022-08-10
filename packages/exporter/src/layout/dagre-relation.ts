import { Label } from "../model/layout-model";

export type SourceElement = Label
export type TargetElement = Label

export interface DagreRelation {
  source: SourceElement;
  target?: TargetElement;
}
