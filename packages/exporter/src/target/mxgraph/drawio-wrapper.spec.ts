import * as fs from "fs";

import { wrapperToDrawIo } from "./drawio-wrapper";
import MxGraphEncode from "./mxgraph-encode";
import { MXCell, MxGraph } from "./mxgraph";

describe('DrawIO Wrapper', () => {
  it('convert model to file', () => {
    const drawioFile = wrapperToDrawIo();
    fs.writeFileSync('./test.drawio', drawioFile);

    const data = MxGraphEncode.decodeXml(drawioFile);
    const xmlInJson: MxGraph = MxGraphEncode.xml2obj(data!) as never;
    const mxCell: MXCell[] = xmlInJson.mxGraphModel.root.mxCell;

    expect(mxCell.length).toBe(2);
  });
});
