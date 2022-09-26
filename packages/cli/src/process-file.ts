import * as fs from "fs";
import * as path from "path";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Converter } from "@feakin/exporter";

function getExtension(filename) {
  const ext = path.extname(filename || '').split('.');
  return ext[ext.length - 1];
}

export async function processFile(inputFile: string, outputFile: string) {
  const inExt = getExtension(inputFile);
  const outExt = getExtension(outputFile);
  const inputContent = fs.readFileSync(inputFile, 'utf8');

  await Converter.fromContent(inputContent, inExt, false).then((graph) => {
    const output = graph.target(outExt);

    fs.writeFileSync(outputFile, output);
  });
}
