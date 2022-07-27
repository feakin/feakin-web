import * as cheerio from 'cheerio';

const convert = require('xml-js');

const pako = require('pako');

const MxGraphEncode = {
  xml2json: (xml: string) => {
    return convert.xml2js(xml, {
      compact: true,
      spaces: 4,
      alwaysChildren: true
    })
  },
  parseXml: (xml: string) => {
    const $ = cheerio.load(xml);
    return $
  },
  decodeXml: (source: string) => {
    const $ = MxGraphEncode.parseXml(source);
    let mxfile = $('mxfile');
    if (mxfile) {
      // @ts-ignore
      const diagrams = cheerio.text($('mxfile diagram'));

      if (diagrams.length > 0) {
        return MxGraphEncode.decode(diagrams);
      }
    }

    return undefined;
  },
  decode: function (diagrams: string) {
    let data = atob(diagrams);
    data = pako.inflateRaw(Uint8Array.from(data, c => c.charCodeAt(0)), { to: 'string' });
    data = decodeURIComponent(data);
    return data;
  },
  encode: (source: string) => {
    const data = encodeURIComponent(source);
    const compressed = pako.deflateRaw(data, { to: 'string' });
    const base64 = btoa(MxGraphEncode.arrayBufferToString(compressed));
    return base64;
  },
  arrayBufferToString: (array: ArrayBuffer) => {
    let result = "";
    array = new Uint8Array(array);
    for (let c = array.byteLength, d = 0; d < c; d++) {
      // @ts-ignore
      result += String.fromCharCode(array[d]);
    }
    return result
  }
}

export default MxGraphEncode;
