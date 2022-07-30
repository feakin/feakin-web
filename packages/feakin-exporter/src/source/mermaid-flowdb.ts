import { FlowEdge } from "./flow";

/**
 * based on Mermaid.js
 * The MIT License (MIT)
 * Copyright (c) 2014 - 2021 Knut Sveidqvist
 */
export class FlowDb {
  vertexCounter = 0;
  vertices: any = {};
  DOM_PREFIX = "feakin-";
  direction: string = "TB";
  edges: FlowEdge[] = [];
  firstGraphFlag = true;

  /**
   * Called by parser when a graph definition is found, stores the direction of the chart.
   *
   * @param dir
   */
  setDirection(dir: string) {
    this.direction = dir;
    if (this.direction.match(/.*</)) {
      this.direction = 'RL';
    }
    if (this.direction.match(/.*\^/)) {
      this.direction = 'BT';
    }
    if (this.direction.match(/.*>/)) {
      this.direction = 'LR';
    }
    if (this.direction.match(/.*v/)) {
      this.direction = 'TB';
    }
  }

  firstGraph() {
    if (this.firstGraphFlag) {
      this.firstGraphFlag = false;
      return true;
    }
    return false;
  };


  getDirection() {
    return this.direction.trim();
  };

  countChar(char: string, str: string) {
    const length = str.length;
    let count = 0;
    for (let i = 0; i < length; ++i) {
      if (str[i] === char) {
        ++count;
      }
    }
    return count;
  };

  destructEndLink(_str: string) {
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

    let dots = this.countChar('.', line);

    if (dots) {
      stroke = 'dotted';
      length = dots;
    }

    return { type, stroke, length };
  };

  destructStartLink(_str: string) {
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

  destructLink(_str: string, _startStr: string) {
    const info = this.destructEndLink(_str);
    let startInfo: any;
    if (_startStr) {
      startInfo = this.destructStartLink(_startStr);

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

  addLink(_start: any, _end: any, type: any, linktext: any) {
    let i, j;
    for (i = 0; i < _start.length; i++) {
      for (j = 0; j < _end.length; j++) {
        this.addSingleLink(_start[i], _end[j], type, linktext);
      }
    }
  };

  sanitizeText(text: string, config?: string) {
    // if (!text) return text;
    // let txt = '';
    // if (config['dompurifyConfig']) {
    //   txt = DOMPurify.sanitize(sanitizeMore(text, config), config['dompurifyConfig']);
    // } else {
    //   txt = DOMPurify.sanitize(sanitizeMore(text, config));
    // }
    return text;
  };


  /**
   * Function called by parser when a link/edge definition has been found
   *
   * @param _start
   * @param _end
   * @param type
   * @param linktext
   */
  addSingleLink(_start: any, _end: any, type: any, linktext: any) {
    let start = _start;
    let end = _end;

    const edge: any = { start: start, end: end, type: undefined, text: '' };
    linktext = type.text;

    if (typeof linktext !== 'undefined') {
      edge.text = this.sanitizeText(linktext.trim());

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
    this.edges.push(edge);
  }

  /**
   * Function called by parser when a node definition has been found
   *
   * @param _id
   * @param text
   * @param type
   * @param style
   * @param classes
   * @param dir
   * @param props
   */
  addVertex(_id: string, text: string, type: string, style: any, classes: string[], dir: string, props = {}) {
    let txt;
    let id = _id;
    if (typeof id === 'undefined') {
      return;
    }
    if (id.trim().length === 0) {
      return;
    }

    if (typeof this.vertices[id] === 'undefined') {
      this.vertices[id] = {
        id: id,
        domId: this.DOM_PREFIX + id + '-' + this.vertexCounter,
        styles: [],
        classes: [],
      };
    }
    this.vertexCounter++;
    if (typeof text !== 'undefined') {
      // config = configApi.getConfig();
      txt = this.sanitizeText(text.trim());

      // strip quotes if string starts and ends with a quote
      if (txt[0] === '"' && txt[txt.length - 1] === '"') {
        txt = txt.substring(1, txt.length - 1);
      }

      this.vertices[id].text = txt;
    } else {
      if (typeof this.vertices[id].text === 'undefined') {
        this.vertices[id].text = _id;
      }
    }
    if (typeof type !== 'undefined') {
      this.vertices[id].type = type;
    }

    const that = this;
    if (typeof style !== 'undefined') {
      if (style !== null) {
        style.forEach(function (s: any) {
          that.vertices[id].styles.push(s);
        });
      }
    }
    if (typeof classes !== 'undefined') {
      if (classes !== null) {
        classes.forEach(function (s: any) {
          that.vertices[id].classes.push(s);
        });
      }
    }
    if (typeof dir !== 'undefined') {
      this.vertices[id].dir = dir;
    }

    that.vertices[id].props = props;
  };
}
