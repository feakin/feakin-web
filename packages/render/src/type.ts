import { SupportedFileType } from "@feakin/exporter";
import { HandDrawing } from "./graph/drawn-style/hand-drawing";

export enum SupportedCodeLang {
  dot = "dot",
  xml = "xml",
  json = "json"
}

export interface CodeProp {
  language: SupportedCodeLang;
  sourceType: SupportedFileType;
  content: string;
}

export interface RenderOptions {
  paintStyle?: boolean;
  paintInstance?: HandDrawing;
}

export interface AppState {
  code: CodeProp,
  render: RenderOptions
}
