import * as cheerio from 'cheerio';
import * as pako from 'pako';
import { xml2js } from './xml-converter';
import { text } from "cheerio";

export const DrawioEncode = {
  xml2obj: xml2js,
  parseXml: (xml: string) => {
    const $ = cheerio.load(xml);
    return $;
  },
  decodeXml: (source: string) => {
    const $ = DrawioEncode.parseXml(source);
    const mxfile = $('mxfile');
    if (mxfile) {
      const $diagrams = $('mxfile diagram');
      const diagrams = text($diagrams);
      if ($diagrams.length == 0) {
        return undefined;
      }

      // todo: related to
      const diagram = $diagrams[0];
      let isDrawioEncodedText = diagram.children.length == 1 && diagram.children[0].type === 'text';
      if (isDrawioEncodedText) {
        return DrawioEncode.decode((diagram.children[0] as any).data);
      }

      if(diagram.children.length > 1) {
        return $diagrams.toString();
      }
    }

    return undefined;
  },
  decode: function (diagrams: string) {
    let data = atob(diagrams);
    data = pako.inflateRaw(
      Uint8Array.from(data, (c) => c.charCodeAt(0)),
      { to: 'string' }
    );
    data = decodeURIComponent(data);
    return data;
  },
  encode: (source: string) => {
    const data = encodeURIComponent(source);
    const compressed = pako.deflateRaw(data);
    const base64 = btoa(DrawioEncode.arrayBufferToString(compressed));
    return base64;
  },
  arrayBufferToString: (array: ArrayBuffer) => {
    let result = '';
    const uint8Array = new Uint8Array(array);
    for (let c = uint8Array.byteLength, d = 0; d < c; d++) {
      result += String.fromCharCode(uint8Array[d]);
    }
    return result;
  },
};

export default DrawioEncode;
