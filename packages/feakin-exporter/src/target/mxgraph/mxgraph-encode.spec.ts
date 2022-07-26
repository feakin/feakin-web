import MxGraphEncode from './mxgraph-encode';

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
});
