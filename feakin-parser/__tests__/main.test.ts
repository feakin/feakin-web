import { flowParser } from '../src/parser/mermaid/flowParser.js';

describe('greeter function', () => {
  it('parse flow', () => {
    const grammar = {
      "lex": {
        "rules": [
          ["\\s+", "/* skip whitespace */"],
          ["[a-f0-9]+", "return 'HEX';"]
        ]
      },

      "bnf": {
        "hex_strings" :[ "hex_strings HEX",
          "HEX" ]
      }
    };

    let parser = flowParser(grammar as any);
    let result = parser.parse("adfe34bc e82a");
    console.log(result);
  });
});
