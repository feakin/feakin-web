import * as convert from 'xml-js';
import { ElementCompact } from "xml-js";

const ATTRIBUTES_KEY = 'attributes';

export function xml2js(xml: string) {
  return convert.xml2js(xml, {
    compact: true,
    alwaysChildren: true,
    attributesKey: ATTRIBUTES_KEY,
  }) as ElementCompact;
}

export function js2xml(obj: object) {
  return convert.js2xml(obj, {
    compact: true,
    attributesKey: ATTRIBUTES_KEY,
  });
}

export function formatXml(xml: string) {
  // https://stackoverflow.com/questions/57039218/doesnt-monaco-editor-support-xml-language-by-default
  const PADDING = ' '.repeat(2);
  const reg = /(>)(<)(\/*)/g;
  let pad = 0;

  xml = xml.replace(reg, '$1\r\n$2$3');

  return xml.split('\r\n').map((node, index) => {
    let indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/) && pad > 0) {
      pad -= 1;
    } else if (node.match(/^<\w[^>]*[^/]>.*$/)) {
      indent = 1;
    } else {
      indent = 0;
    }

    pad += indent;

    return PADDING.repeat(pad - indent) + node;
  }).join('\r\n');
}
