import * as convert from 'xml-js';

export function xml2js(xml: string) {
  return convert.xml2js(xml, {
    compact: true,
    alwaysChildren: true,
    attributesKey: 'attributes',
  });
}

export function js2xml(obj: object) {
  return convert.js2xml(obj, {
    compact: true,
    attributesKey: 'attributes',
  });
}
