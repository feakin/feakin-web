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
    let graph = new (window as any).Graph(this.graphEl);
    graph.resizeContainer = true;
    graph.centerZoom = true;
    graph.zoomWheel = true;

    graph.setTooltips(false);
    graph.setConnectable(false);
    graph.setEnabled(false);
  }

  render() {
    return <div ref={ el => this.graphEl = el as HTMLElement }></div>;
  }
}
