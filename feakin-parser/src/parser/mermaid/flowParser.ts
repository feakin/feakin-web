import { Parser } from "jison";

type ParserGrammar = { lex: { rules: string[][]; }; bnf: { hex_strings: string[]; }; };

export function flowParser(grammer: ParserGrammar): Parser {
  const parser = new Parser(grammer);
  // const parserSource = parser.generate();
  return parser;
}
