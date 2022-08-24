import * as fs from "fs";
import * as path from "path";

function getExtension(filename) {
  const ext = path.extname(filename || '').split('.');
  return ext[ext.length - 1];
}

export function processFile(inputFile: string, outputFile: string) {
  const extname = getExtension(inputFile);
  const inputContent = fs.readFileSync(inputFile, 'utf8');

  new Converter();

}
