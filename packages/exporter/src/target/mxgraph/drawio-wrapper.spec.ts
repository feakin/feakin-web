import * as fs from "fs";

import { wrapperToDrawIo } from "./drawio-wrapper";
import DrawioEncode from "./drawio-encode";
import { MXCell, MxGraph } from "./mxgraph";

describe('DrawIO Wrapper', () => {
  it('convert model to file', () => {
    const drawioFile = wrapperToDrawIo();
    fs.writeFileSync('./test.drawio', drawioFile);

    const data = DrawioEncode.decodeXml(drawioFile);
    const xmlInJson: MxGraph = DrawioEncode.xml2obj(data!) as never;
    const mxCell: MXCell[] = xmlInJson.mxGraphModel.root.mxCell;

    expect(mxCell.length).toBe(2);
  });
});
