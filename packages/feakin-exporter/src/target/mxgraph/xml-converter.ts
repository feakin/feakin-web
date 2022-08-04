import * as convert from 'xml-js';
import { js2xml } from "xml-js";

export function xml2json(xml: string) {
  return convert.xml2js(xml, {
    compact: true,
    alwaysChildren: true,
    attributesKey: 'attributes',
  });
}

export function obj2xml(obj: object) {
  return convert.js2xml(obj, {
    compact: true,
    attributesKey: 'attributes',
  });
}

export function inlineAttrs(obj: any) {
  for (const prop in obj) {
    if (typeof obj[prop] == 'object') {
      if (obj[prop]._attributes) {
        Object.assign(obj[prop], obj[prop]._attributes);
        delete obj[prop]._attributes;
      }
      inlineAttrs(obj[prop]);
    }
  }
  return obj;
}

// todo: need to remove this?
export function xml2obj(xml: string) {
  return inlineAttrs(xml2json(xml));
}
