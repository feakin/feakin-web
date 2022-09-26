import { graphvizSync } from "@hpcc-js/wasm";
import { DotWasmImporter } from "./dot-wasm-importer";
import { Graph } from "../../model/graph";

describe('Dot Wasm', () => {
  it('parse graphviz location', () => {
    expect(DotWasmImporter.parseGraphvizPos(undefined)).toEqual([{x: 0, y: 0}]);
    expect(DotWasmImporter.parseGraphvizPos("")).toEqual([{x: 0, y: 0}]);
    expect(DotWasmImporter.parseGraphvizPos("0,0")).toEqual([{x: 0, y: 0}]);
    expect(DotWasmImporter.parseGraphvizPos("e,27,36.104 27,71.697")).toEqual([{x: 27, y: 36.104}, {x: 27, y: 71.697}]);
    expect(DotWasmImporter.parseGraphvizPos("s,27,36.104 27,71.697")).toEqual([{x: 27, y: 36.104}, {x: 27, y: 71.697}]);
  });

  it('compare items', async () => {
    const source = `digraph {
  a -> b
}`;
    const importer = new DotWasmImporter(source);

    const output = await graphvizSync().then((graph) => {
      return graph.layout(source, "json")
    });

    console.log(output);

    const graph: Graph = await importer.parsePromise();

    console.log(JSON.stringify(graph));
  });

  it('normal importer', () => {
    const importer = new DotWasmImporter(`digraph {
  a -> b
}`);
    const graph: Graph = importer.parse();
    console.log(JSON.stringify(graph));
  });


  it('sample', async () => {
    const source = `digraph G {
  compound=true;
  subgraph cluster0 {
    a [shape="triangle", fillcolor=red, style=filled];
    b [shape="diamond"];
    a -> b;
    c -> d;
  }
  subgraph cluster1 {
    e -> g;
    e -> f;
  }
}`;

    const output = await graphvizSync().then((graph) => {
      return graph.layout(source, "json")
    });

    console.log(output);
  });

  it('sample 2', async () => {
    const source = `digraph TicketBooking {
  component=true;layout=fdp;
  node [shape=box style=filled];
  cluster_reservation -> cluster_cinema [label="AntiCorruptionLayer",headlabel="D"];
  cluster_reservation -> cluster_movie;
  cluster_reservation -> cluster_user;

  subgraph cluster_cinema {
    label="Cinema(Context)";

    subgraph cluster_aggregate_cinema {
      label="Cinema(Aggregate)";
      entity_Cinema [label="Cinema"];
      entity_ScreeningRoom [label="ScreeningRoom"];
      entity_Seat [label="Seat"];
    }
  }

  subgraph cluster_movie {
    label="Movie(Context)";

    subgraph cluster_aggregate_movie {
      label="Movie(Aggregate)";
      entity_Movie [label="Movie"];
      entity_Actor [label="Actor"];
      entity_Publisher [label="Publisher"];
    }
  }

  subgraph cluster_reservation {
    label="Reservation(Context)";

    subgraph cluster_aggregate_reservation {
      label="Reservation(Aggregate)";
      entity_Ticket [label="Ticket"];
      entity_Reservation [label="Reservation"];
    }
  }

  subgraph cluster_user {
    label="User(Context)";

    subgraph cluster_aggregate_user {
      label="User(Aggregate)";
      entity_User [label="User"];
    }
  }
}`;

    const output = await graphvizSync().then((graph) => {
      return graph.layout(source, "json", "fdp")
    });
    // console.log(output);
  });
});
