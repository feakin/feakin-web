import MxGraphEncode from './mxgraph-encode';
import { MxGraph, MxGraphModel } from "./mxgraph";

describe('MxGraphEncoder', () => {
  it('should work', () => {
    const sampleStr = '<mxfile host="Electron" modified="2022-07-26T06:50:38.916Z" agent="5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) draw.io/19.0.3 Chrome/102.0.5005.63 Electron/19.0.3 Safari/537.36" etag="S-i-T2jFARcjY2b3OQvQ" version="19.0.3" type="device"><diagram id="bN4dli3-ZhfTxRglmdzi" name="Page-1">jZJNT8QgEIZ/DUcTWlbdPdp11Rj1YA97NKSMhQRKw1Lb+uulduhHNpvsieGZD2begbC96Z4dr+W7FaBJSkVH2CNJ0yTdbcMxkH4k2106gtIpgUEzyNUvIKRIGyXgtAr01mqv6jUsbFVB4VeMO2fbddi31etXa17CGcgLrs/pUQkvcYpbOvMXUKWMLycUPYbHYAQnyYVtF4gdCNs7a/1omW4PehAv6jLmPV3wTo05qPw1CQ+feUk39r4zx+yL5R/ZK7zdYJUfrhscGJv1fVTA2aYSMBShhGWtVB7ymheDtw07D0x6o8MtCSaWA+ehu9hnMk0fvg1YA971IQQT2B0Khj9mw/DezvonUVS50D7mcVx5OZWeVQkGChOv8wL+fYtvzA5/</diagram></mxfile>';
    let data = MxGraphEncode.decodeXml(sampleStr);
    expect(data?.startsWith('<mxGraphModel')).toBeTruthy();
  });

  it('encode with decode', () => {
    let source = '<mxGraphModel><root><mxCell id="0"/></root></mxGraphModel>';
    let encoded = MxGraphEncode.encode(source);
    let decoded = MxGraphEncode.decode(encoded);
    expect(decoded).toEqual(source);
  });

  // todo: add parse to text to json
  it('text from hello world', () => {
    const sampleStr = '<mxfile host="Electron" modified="2022-07-26T12:42:39.225Z" agent="5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) draw.io/19.0.3 Chrome/102.0.5005.63 Electron/19.0.3 Safari/537.36" etag="O1qmAbmb6dEBzrUx5KlV" version="19.0.3" type="device"><diagram id="bN4dli3-ZhfTxRglmdzi" name="Page-1">jZNNT4QwEIZ/i4ceTYDuh1cX190Y9SCHPZqGjrRJYbAUYf31lm270BgTL2T6vPPRzgyE5vV40KwVL8hBkSzhI6EPJMvWq9R+J3B2gG4zByotuUPpDAr5DR4mnvaSQxc5GkRlZBvDEpsGShMxpjUOsdsHqrhqyyr4BYqSqd/0JLkRjt6tk5kfQVYiVE4Tr9QsOHvQCcZxWCC6JzTXiMZZ9ZiDmnoX+uLiHv9QrxfT0Jj/BNy/FVWywu1Yn3bvtHjdPcHzrc/yxVTvH0yyjbL5dq0Ga1aTGVDXsmZqtWKd6+rms8eLMJsh5miLI8ly6z+gVvwmJLEXdHni3BZHFS8dM+cwBo19w2F6SWLlQUgDRcvKSR3s3lkmTK3sKb1GLzsTngnawLhAvlMHwBqMPlsXr9KNn5pf2xX152FegjRMViwWIMQxv3fVNfU8Gmv46YTjvAUXbfEr0f0P</diagram></mxfile>';
    let encoded = MxGraphEncode.decodeXml(sampleStr);

    let xmlInJson: MxGraph = MxGraphEncode.xml2json(encoded!);

    expect(xmlInJson.mxGraphModel.root.mxCell.length).toBe(3);
  });
});
