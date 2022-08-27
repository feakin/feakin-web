import { SupportedFileType } from "@feakin/exporter";

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
