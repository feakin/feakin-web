import { Parser } from "jison";

type ParserGrammar = { lex: { rules: string[][]; }; bnf: { hex_strings: string[]; }; };
export class FlowParser {
  private parser: ParserGrammar;

  constructor(grammar: ParserGrammar) {
    this.parser = new Parser(grammar);
  }

  // todo: add cache for parser
  public parse(text: string): any {
    return this.parser.parse(text);
  }
}
