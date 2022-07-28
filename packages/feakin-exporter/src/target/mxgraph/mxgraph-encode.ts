import cheerio from 'cheerio';
import * as pako from 'pako';
import { xml2obj } from './xml-converter';

const MxGraphEncode = {
  xml2obj: xml2obj,
  parseXml: (xml: string) => {
    const $ = cheerio.load(xml);
    return $;
  },
  decodeXml: (source: string) => {
    const $ = MxGraphEncode.parseXml(source);
    const mxfile = $('mxfile');
    if (mxfile) {
      const diagrams = cheerio.text($('mxfile diagram'));

      if (diagrams.length > 0) {
        return MxGraphEncode.decode(diagrams);
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
    const base64 = btoa(MxGraphEncode.arrayBufferToString(compressed));
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

export default MxGraphEncode;
