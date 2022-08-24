/**
 * based on Mermaid.js
 * The MIT License (MIT)
 * Copyright (c) 2014 - 2021 Knut Sveidqvist
 */
import { FlowEdge, FlowNode } from "./flow";

export class FlowDb {
  vertexCounter = 0;
  vertices: { [key: string]: FlowNode; }  = {};
  DOM_PREFIX = "feakin-";
  direction = "TB";
  edges: FlowEdge[] = [];
  firstGraphFlag = true;
  version = 'gen-1';
  subCount = 0;
  subGraphs: any[] = [];
  subGraphLookup: any = {};

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
  }


  getDirection() {
    return this.direction.trim();
  }

  countChar(char: string, str: string) {
    const length = str.length;
    let count = 0;
    for (let i = 0; i < length; ++i) {
      if (str[i] === char) {
        ++count;
      }
    }
    return count;
  }

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

    const dots = this.countChar('.', line);

    if (dots) {
      stroke = 'dotted';
      length = dots;
    }

    return { type, stroke, length };
  }

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
  }

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
  }

  addLink(_start: any[], _end: any[], type: string, linktext: string) {
    let i, j;
    for (i = 0; i < _start.length; i++) {
      for (j = 0; j < _end.length; j++) {
        this.addSingleLink(_start[i], _end[j], type, linktext);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sanitizeText(text: string, config?: string) {
    // if (!text) return text;
    // let txt = '';
    // if (config['dompurifyConfig']) {
    //   txt = DOMPurify.sanitize(sanitizeMore(text, config), config['dompurifyConfig']);
    // } else {
    //   txt = DOMPurify.sanitize(sanitizeMore(text, config));
    // }
    return text;
  }


  /**
   * Function called by parser when a link/edge definition has been found
   *
   * @param _start
   * @param _end
   * @param type
   * @param linktext
   */
  addSingleLink(_start: any, _end: any, type: any, linktext: any) {
    const start = _start;
    const end = _end;

    const edge: FlowEdge = { start: start, end: end, type: undefined, text: '' };
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
    const id = _id;
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

    // eslint-disable-next-line @typescript-eslint/no-this-alias
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
  }

  /**
   * Function to lookup domId from id in the graph definition.
   *
   * @param id
   * @public
   */
  lookUpDomId(id: string) {
    const veritceKeys = Object.keys(this.vertices);
    for (let i = 0; i < veritceKeys.length; i++) {
      if (this.vertices[veritceKeys[i]].id === id) {
        return this.vertices[veritceKeys[i]].domId;
      }
    }

    return id;
  }


// Todo optimizer this by caching existing nodes
  exists(allSgs: object[], _id: string) {
    let res = false;
    allSgs.forEach((sg: any) => {
      const pos = sg.nodes.indexOf(_id);
      if (pos >= 0) {
        res = true;
      }
    });
    return res;
  }

  /**
   * Deletes an id from all subgraphs
   *
   * @param sg
   * @param allSubgraphs
   */
  makeUniq(sg: any, allSubgraphs: object[]) {
    const res: any[] = [];
    sg.nodes.forEach((_id: any, pos: any) => {
      if (!this.exists(allSubgraphs, _id)) {
        res.push(sg.nodes[pos]);
      }
    });
    return { nodes: res };
  }

  /**
   * Clears the internal graph db so that a new graph can be parsed.
   *
   * @param _id
   * @param list
   * @param _title
   */
  addSubGraph(_id: string, list: any[], _title: string) {
    // console.log('addSubGraph', _id, list, _title);
    let id: string | undefined = _id.trim();
    let title = _title;
    if (_id === _title && _title.match(/\s/)) {
      id = undefined;
    }

    /** @param a */
    function uniq(a: any[]) {
      const prims: any = { boolean: {}, number: {}, string: {} };
      const objs: object[] = [];

      let dir; //  = undefined; direction.trim();
      const nodeList = a.filter(function (item) {
        const type = typeof item;
        if (item.stmt && item.stmt === 'dir') {
          dir = item.value;
          return false;
        }
        if (item.trim() === '') {
          return false;
        }
        if (type in prims) {
          return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true); // eslint-disable-line
        } else {
          return objs.indexOf(item) >= 0 ? false : objs.push(item);
        }
      });
      return { nodeList, dir };
    }

    let nodeList: string[] = [];
    // eslint-disable-next-line prefer-spread
    const { nodeList: nl, dir } = uniq(nodeList.concat.apply(nodeList, list));
    nodeList = nl;
    if (this.version === 'gen-1') {
      for (let i = 0; i < nodeList.length; i++) {
        nodeList[i] = this.lookUpDomId(nodeList[i]);
      }
    }

    id = id || 'subGraph' + this.subCount;
    // if (id[0].match(/\d/)) id = lookUpDomId(id);
    title = title || '';
    title = this.sanitizeText(title);
    this.subCount = this.subCount + 1;
    const subGraph = { id: id, nodes: nodeList, title: title.trim(), classes: [], dir };
    /** Deletes an id from all subgraphs */
    // const del = _id => {
    //   subGraphs.forEach(sg => {
    //     const pos = sg.nodes.indexOf(_id);
    //     if (pos >= 0) {
    //       sg.nodes.splice(pos, 1);
    //     }
    //   });
    // };

    // // Removes the members of this subgraph from any other subgraphs, a node only belong to one subgraph
    // subGraph.nodes.forEach(_id => del(_id));

    // Remove the members in the new subgraph if they already belong to another subgraph
    subGraph.nodes = this.makeUniq(subGraph, this.subGraphs).nodes;
    this.subGraphs.push(subGraph);
    this.subGraphLookup[id] = subGraph;
    return id;
  }

  getSubGraphs() {
    return this.subGraphs;
  }
}
