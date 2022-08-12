import { SvgShapeDrawing } from "./svg-shape-drawing";
import * as fs from "fs";
import { dataURLtoFileData } from "./utils/data-url";
import { CanvasShapeDrawing } from "./canvas-shape-drawing";

function xmlToImage(xml: string) {
  const img = new Image();
  const svg64 = btoa(xml);
  const b64Start = 'data:image/svg+xml;base64,';
  const image64 = b64Start + svg64;
  img.src = image64;
  return { img, image64 };
}

function loadImage(svg: SVGElement, canvas: any, ctx: any) {
  const serializer = new XMLSerializer();
  const xml = serializer.serializeToString(svg);
  const { img } = xmlToImage(xml);

  img.onload = function () {
    canvas.getContext('2d').drawImage(img, 0, 0);

    let canvasDrawing = new CanvasShapeDrawing(ctx);
    let canvasElement = canvasDrawing.ctx.canvas;

    let fileData = dataURLtoFileData(canvasElement.toDataURL('image/png'));
    console.log(fileData);

    fs.writeFileSync('./test/svg.png', fileData.data);
  }

  img.src = "./test/svg.png";
}

const load = (url: string = "") => new Promise(resolve => {
  const img = new Image()
  img.onload = () => resolve({ url, ratio: img.naturalWidth / img.naturalHeight })
  img.src = url
});

describe('DrawingDiff', () => {
  let svg: SVGElement;
  let canvas: any, ctx: any;

  beforeEach(function () {
    svg = document.createElement('svg') as unknown as SVGElement;

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
  });

  it('diff svg and canvas', async () => {
    let drawing = new SvgShapeDrawing(svg as SVGElement);
    drawing.drawPath([{ x: 0, y: 0 }, { x: 50, y: 50 }, { x: 50, y: 100 }, { x: -50, y: 100 }]);
    await loadImage(svg, canvas, ctx);
  });
});
