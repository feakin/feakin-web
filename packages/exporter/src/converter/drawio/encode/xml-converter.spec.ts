import { js2xml } from "./xml-converter";

describe('Xml Converter', () => {
  const json = {
    "mxGraphModel": {
      "attributes": {
        "dx": "541",
        "dy": "372",
        "grid": "1",
        "gridSize": "10",
        "guides": "1",
        "tooltips": "1",
        "connect": "1",
        "arrows": "1",
        "fold": "1",
        "page": "1",
        "pageScale": "1",
        "pageWidth": "850",
        "pageHeight": "1100",
        "math": "0",
        "shadow": "0"
      },
      "root": {
        "mxCell": [
          {
            "attributes": {
              "id": "0"
            }
          },
          {
            "attributes": {
              "id": "1",
              "parent": "0"
            }
          },
          {
            "attributes": {
              "id": "ARSg04o7xmWB_3SNBJeL-1",
              "value": "<pre><span class=\"s\">Hello, world!</span></pre>",
              "style": "rounded=0;whiteSpace=wrap;html=1;",
              "parent": "1",
              "vertex": "1"
            },
            "mxGeometry": {
              "attributes": {
                "x": "360",
                "y": "430",
                "width": "120",
                "height": "60",
                "as": "geometry"
              }
            }
          }
        ]
      }
    }
  }

  it('from js', () => {
    const result = js2xml(json);
    expect(result).toBe(`<mxGraphModel dx="541" dy="372" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="ARSg04o7xmWB_3SNBJeL-1" value="<pre><span class=&quot;s&quot;>Hello, world!</span></pre>" style="rounded=0;whiteSpace=wrap;html=1;" parent="1" vertex="1"><mxGeometry x="360" y="430" width="120" height="60" as="geometry"/></mxCell></root></mxGraphModel>`);
  });
});
