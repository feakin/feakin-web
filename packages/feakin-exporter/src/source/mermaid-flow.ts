import { FlowEdge } from "./flow";

/**
 * based on Mermaid.js
 * The MIT License (MIT)
 * Copyright (c) 2014 - 2021 Knut Sveidqvist
 */

const Converter = require("@feakin/converter");

let direction: string;
export const setDirection = function (dir: string) {
  direction = dir;
  if (direction.match(/.*</)) {
    direction = 'RL';
  }
  if (direction.match(/.*\^/)) {
    direction = 'BT';
  }
  if (direction.match(/.*>/)) {
    direction = 'LR';
  }
  if (direction.match(/.*v/)) {
    direction = 'TB';
  }
}

const countChar = (char: string, str: string) => {
  const length = str.length;
  let count = 0;
  for (let i = 0; i < length; ++i) {
    if (str[i] === char) {
      ++count;
    }
  }
  return count;
};

const destructEndLink = (_str: string) => {
  const str = _str.trim();
  let line = str.slice(0, -1);
  let type = 'arrow_open';

  switch (str.slice(-1)) {
    case 'x':
      type = 'arrow_cross';
      if (str[0] === 'x') {
        type = 'double_' + type;
        line = line.slice(1);
      }
      break;
    case '>':
      type = 'arrow_point';
      if (str[0] === '<') {
        type = 'double_' + type;
        line = line.slice(1);
      }
      break;
    case 'o':
      type = 'arrow_circle';
      if (str[0] === 'o') {
        type = 'double_' + type;
        line = line.slice(1);
      }
      break;
  }

  let stroke = 'normal';
  let length = line.length - 1;

  if (line[0] === '=') {
    stroke = 'thick';
  }

  let dots = countChar('.', line);

  if (dots) {
    stroke = 'dotted';
    length = dots;
  }

  return { type, stroke, length };
};

const destructStartLink = (_str: string) => {
  let str = _str.trim();
  let type = 'arrow_open';

  switch (str[0]) {
    case '<':
      type = 'arrow_point';
      str = str.slice(1);
      break;
    case 'x':
      type = 'arrow_cross';
      str = str.slice(1);
      break;
    case 'o':
      type = 'arrow_circle';
      str = str.slice(1);
      break;
  }

  let stroke = 'normal';

  if (str.indexOf('=') !== -1) {
    stroke = 'thick';
  }

  if (str.indexOf('.') !== -1) {
    stroke = 'dotted';
  }

  return { type, stroke };
};

const destructLink = (_str: string, _startStr: string) => {
  const info = destructEndLink(_str);
  let startInfo: any;
  if (_startStr) {
    startInfo = destructStartLink(_startStr);

    if (startInfo.stroke !== info.stroke) {
      return { type: 'INVALID', stroke: 'INVALID' };
    }

    if (startInfo.type === 'arrow_open') {
      // -- xyz -->  - take arrow type from ending
      startInfo.type = info.type;
    } else {
      // x-- xyz -->  - not supported
      if (startInfo.type !== info.type) return { type: 'INVALID', stroke: 'INVALID' };

      startInfo.type = 'double_' + startInfo.type;
    }

    if (startInfo.type === 'double_arrow') {
      startInfo.type = 'double_arrow_point';
    }

    startInfo.length = info.length;
    return startInfo;
  }

  return info;
};

export const addLink = function (_start: any, _end: any, type: any, linktext: any) {
  let i, j;
  for (i = 0; i < _start.length; i++) {
    for (j = 0; j < _end.length; j++) {
      addSingleLink(_start[i], _end[j], type, linktext);
    }
  }
};

const sanitizeText = (text: string, config?: string) => {
  // if (!text) return text;
  // let txt = '';
  // if (config['dompurifyConfig']) {
  //   txt = DOMPurify.sanitize(sanitizeMore(text, config), config['dompurifyConfig']);
  // } else {
  //   txt = DOMPurify.sanitize(sanitizeMore(text, config));
  // }
  return text;
};

let edges: FlowEdge[] = [];
export const addSingleLink = function (_start: any, _end: any, type: any, linktext: any) {
  let start = _start;
  let end = _end;

  const edge: any = { start: start, end: end, type: undefined, text: '' };
  linktext = type.text;

  if (typeof linktext !== 'undefined') {
    edge.text = sanitizeText(linktext.trim());

    // strip quotes if string starts and exnds with a quote
    if (edge.text[0] === '"' && edge.text[edge.text.length - 1] === '"') {
      edge.text = edge.text.substring(1, edge.text.length - 1);
    }
  }

  if (typeof type !== 'undefined') {
    edge.type = type.type;
    edge.stroke = type.stroke;
    edge.length = type.length;
  }
  edges.push(edge);
}

export function flow(str: string) {
  let flowParser = Converter.flowParser();
  flowParser.parser.yy = {
    setDirection,
    addVertex: () => {
    },
    addLink,
    destructLink,
    lex: {
      firstGraph: () => {
        return true;
      }
    }
  };

  flowParser.parser.yy.graphType = "flowchart";
  flowParser.parse(str)

  return {
    direction,
    edges,
  };
}
