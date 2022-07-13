import { Component, h, Prop } from '@stencil/core';
import './assets/embed.js';

@Component({
  tag: 'feakin-drawio',
  styleUrl: 'feakin-drawio.css',
  shadow: true,
})
export class FeakinDrawio {
  private graphEl: HTMLElement;

  @Prop() file: string;

  constructor() {

    fetch(this.file)
      .then(response => response.text())
      .then(text => {
        this.createGraph(text);
      });
  }

  private createGraph(text: string) {
    let graph = new (window as any).Graph(this.graphEl);
    graph.resizeContainer = true;
    graph.centerZoom = true;
    graph.zoomWheel = true;

    graph.setTooltips(false);
    graph.setConnectable(false);
    graph.setEnabled(false);

    let decoded = this.decode(text);
    const node = this.parseXml(decoded);
    console.log(node);
    let cells = graph.importGraphModel(node.documentElement);
    this.fitWindow(graph, cells);
  }

  fitWindow(graph, cells) {
    var bounds = graph.getGraphBounds();

    var t = graph.view.translate;
    var s = graph.view.scale;

    bounds.x = bounds.x / s - t.x;
    bounds.y = bounds.y / s - t.y;
    bounds.width /= s;
    bounds.height /= s;

    graph.view.translate.x = - t.x;
    graph.view.translate.y = - t.y;

    graph.setSelectionCells(cells)
    graph.scrollCellToVisible(graph.getSelectionCell());
    graph.moveCells(cells, 0 - bounds.x, 0 - bounds.y)

    graph.fitWindow(bounds, 10, 10)
  }

  private decode(text: string) {
    try {
      console.log(".............");

      var node = this.parseXml(text);

      if (node != null && node.firstChild.nodeName == 'mxfile') {
        const diagrams = node.getElementsByTagName('diagram');
        if (diagrams.length > 0) {
          let data = this.getTextContent(diagrams[0]);
          data = atob(data);
          data = (window as any).pako.inflateRaw(Uint8Array.from(data, (c: any) => c.charCodeAt(0)), { to: 'string' });
          data = decodeURIComponent(data);
          return data;
        }
      }
    } catch (e) {
      throw e;
    }
  }

  private parseXml(text: string) {
    let parser = new DOMParser();
    return parser.parseFromString(text, 'text/xml');
  }

  private getTextContent(node) {
    return (node != null) ? node[ (node.textContent === undefined) ? 'text' : 'textContent' ] : '';
  }

  render() {
    return <div ref={ el => this.graphEl = el as HTMLElement }></div>;
  }
}
