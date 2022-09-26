import { SupportedFileType } from "@feakin/exporter";
import { HandDrawing } from "./graph/drawn-style/hand-drawing";
import { SupportedLayout } from "@feakin/exporter/src/layout/layout-engine";

export enum SupportedCodeLang {
  dot = "dot",
  xml = "xml",
  json = "json",
  fkl = "fkl"
}

export interface CodeProp {
  language: SupportedCodeLang;
  sourceType: SupportedFileType;
  content: string;
}

export interface RenderOptions {
  layout?: SupportedLayout,
  paintStyle?: boolean;
  paintInstance?: HandDrawing;
}

export interface AppState {
  code: CodeProp,
  render: RenderOptions
}
