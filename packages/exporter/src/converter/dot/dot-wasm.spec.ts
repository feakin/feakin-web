import {graphvizSync} from "@hpcc-js/wasm";

describe('Dot Wasm', () => {
  it('edge with', async () => {
    const source = `digraph {
  a -> b
  a -> b
  b -> a [color=blue]
}
`;

    const output = await graphvizSync().then((graph) => {
      return graph.layout(source, "json", "fdp")
    });

    console.log(output);
  });
});
