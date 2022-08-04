import * as convert from 'xml-js';

const ATTRIBUTES_KEY = 'attributes';

export function xml2js(xml: string) {
  return convert.xml2js(xml, {
    compact: true,
    alwaysChildren: true,
    attributesKey: ATTRIBUTES_KEY,
  });
}

export function js2xml(obj: object) {
  return convert.js2xml(obj, {
    compact: true,
    attributesKey: ATTRIBUTES_KEY,
  });
}
