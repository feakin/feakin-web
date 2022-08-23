import * as fs from "fs";
import * as path from "path";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { DrawioConverter, DrawioEncode, ExcalidrawExporter, Executor, Graph } from "@feakin/exporter";

export function mermaidToExcalidraw(inputContent: string, outputFile: string) {
  const executor = new Executor();
  const graph: Graph = executor.sourceToDagre(inputContent);
  const output = new ExcalidrawExporter(graph).export();

  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
}

function drawioToExcalidraw(inputContent: string, outputFile: string) {
  const encoded: any = DrawioEncode.decodeXml(inputContent);
  const mxGraph = DrawioEncode.xml2obj(encoded) as any;
  const drawioConverter = new DrawioConverter(mxGraph);
  const sourceTargetGraph: Graph = drawioConverter.convert();

  const exporter = new ExcalidrawExporter(sourceTargetGraph).export();

  fs.writeFileSync(outputFile, JSON.stringify(exporter, null, 2));
}

export function processFile(inputFile: string, outputFile: string) {
  const extname = path.extname(inputFile);
  const inputContent = fs.readFileSync(inputFile, 'utf8');

  switch (extname) {
    case ".mermaid":
      mermaidToExcalidraw(inputContent, outputFile);
      break;
    case ".drawio":
      drawioToExcalidraw(inputContent, outputFile);
      break;
    default:
      throw new Error("Unsupported file type");
  }

}
