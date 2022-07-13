import { Component, Prop, h } from '@stencil/core';
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

    const node = this.parseXml(this.decode(text));
    let cells = graph.importGraphModel(node.documentElement);
    console.log(cells);
  }

  private decode(text: string) {
    let node = this.parseXml(text);

    if (node != null && node.nodeName == 'mxfile') {
      const diagrams = node.getElementsByTagName('diagram');
      if (diagrams.length > 0) {
        let data = this.getTextContent(diagrams[0]);
        data = atob(data);
        data = (window as any).pako.inflateRaw(Uint8Array.from(data, (c: any) => c.charCodeAt(0)), { to: 'string' });
        data = decodeURIComponent(data);
        return data;
      }
    }
  }

  private parseXml(text: string) {
    var parser = new DOMParser();
    let node = parser.parseFromString(text, 'text/xml');
    return node;
  }

  private getTextContent(node) {
    return (node != null) ? node[ (node.textContent === undefined) ? 'text' : 'textContent' ] : '';
  }

  render() {
    return <div ref={ el => this.graphEl = el as HTMLElement }></div>;
  }
}
