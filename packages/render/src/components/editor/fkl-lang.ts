import { languages } from "monaco-editor";
import { fklTokenConfig } from "./fkl-token";

const State: languages.IState = {
  clone: () => ({ ...State }),
  equals: () => false,
};

export const LANG_ID = "fkl";

export function addFklLangSupport(monaco: any) {
  monaco.languages.register({ id: LANG_ID });

  monaco.languages.setLanguageConfiguration(LANG_ID, {
    wordPattern: /(-?\d*\.\d*)|(\w+[0-9]*)/,
    // Takem from: https://github.com/Microsoft/monaco-json/blob/master/src/jsonMode.ts#L42-L60
    comments: {
      lineComment: "//",
      blockComment: ["/*", "*/"],
    },
    brackets: [
      ["{", "}"],
    ],
    autoClosingPairs: [
      { open: "{", close: "}", notIn: ["string"] },
      { open: "\"", close: "\"", notIn: ["string"] },
    ],
  });

  monaco.languages.setMonarchTokensProvider(LANG_ID, fklTokenConfig);
}
