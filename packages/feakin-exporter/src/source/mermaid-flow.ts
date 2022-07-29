const Converter = require("@feakin/converter");

export function flow(str: string) {
  let flowParser = Converter.flowParser;
  // todo: add mermaid for parser;
  flowParser.parser.yy = {
    lex: {
      firstGraph: () => {
        return true;
      }
    }
  };

  // return flowParser.parse(str);
  return '';
}
