import { SupportedFileType } from "@feakin/exporter";
import { SupportedCodeLang } from "../type";

export function getExtension(filename: string) {
  return filename.split('.').pop();
}

export function extToCodeType(ext: string): {
  sourceType: SupportedFileType,
  lang: SupportedCodeLang
} | null {
  switch (ext) {
    case "dot":
      return {
        sourceType: SupportedFileType.GRAPHVIZ,
        lang: SupportedCodeLang.dot
      };
    case "mermaid":
      return {
        sourceType: SupportedFileType.MERMAID,
        lang: SupportedCodeLang.dot
      };
    case "excalidraw":
      return {
        sourceType: SupportedFileType.EXCALIDRAW,
        lang: SupportedCodeLang.json
      }
    case "drawio":
      return {
        sourceType: SupportedFileType.DRAWIO,
        lang: SupportedCodeLang.xml
      }
    case "fkl":
      return {
        sourceType: SupportedFileType.Feakin,
        lang: SupportedCodeLang.fkl
      }
    default:
      return null;
  }
}
