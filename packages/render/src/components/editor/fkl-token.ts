/* eslint-disable */
// decorator on: [https://github.com/nikeee/edotor.net](https://github.com/nikeee/edotor.net)
// Taken from the samples of: https://microsoft.github.io/monaco-editor/monarch.html
export const fklTokenConfig = {
  // Set defaultToken to invalid to see what you do not tokenize yet
  // defaultToken: 'invalid',
  keywords: [
    'ContextMap', 'Context', 'Aggregate', 'Entity', 'ValueObject', 'VO', 'Struct'
  ],

  builtins: [
    'rank', 'rankdir', 'ranksep', 'size', 'ratio',
    'label', 'headlabel', 'taillabel',
    'arrowhead', 'samehead', 'samearrowhead',
    'arrowtail', 'sametail', 'samearrowtail', 'arrowsize',
    'labeldistance', 'labelangle', 'labelfontsize',
    'dir', 'width', 'height', 'angle',
    'fontsize', 'fontcolor', 'same', 'weight', 'color',
    'bgcolor', 'style', 'shape', 'fillcolor', 'nodesep', 'id',
  ],

  attributes: [
    'doublecircle', 'circle', 'diamond', 'box', 'point', 'ellipse', 'record',
    'inv', 'invdot', 'dot', 'dashed', 'dotted', 'filled', 'back', 'forward',
  ],

  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers and keywords
      [/[a-zA-Z_\x80-\xFF][\w\x80-\xFF]*/, {
        cases: {
          '@keywords': 'keyword',
          '@builtins': 'predefined',
          '@attributes': 'constructor',
          '@default': 'identifier'
        }
      }],

      // whitespace
      { include: '@whitespace' },

      // delimiters and operators
      [/[{}()\[\]]/, '@brackets'],
      [/@symbols/, {
        cases: {
          '@keywords': 'keyword',
          '@default': 'operator'
        }
      }],

      // delimiter
      [/[;,]/, 'delimiter'],

      // numbers
      [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
      [/0[xX][0-9a-fA-F]+/, 'number.hex'],
      [/\d+/, 'number'],

      // strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
      [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
    ],

    comment: [
      [/[^\/*]+/, 'comment'],
      [/\/\*/, 'comment', '@push'],    // nested comment
      ["\\*/", 'comment', '@pop'],
      [/[\/*]/, 'comment']
    ],

    string: [
      [/[^\\"&]+/, 'string'],
      [/\\"/, 'string.escape'],
      [/&\w+;/, 'string.escape'],
      [/[\\&]/, 'string'],
      [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
      [/#.*$/, 'comment'],
    ],
  },
};
