import { graphvizSync } from "@hpcc-js/wasm";
import { GraphvizToGim, parseGraphvizPos } from "./dot-wasm-importer";
import { DotImporter } from "./dot-importer";
import { Graph } from "../../model/graph";

describe('Dot Wasm', () => {
  it('parse graphviz location', () => {
    expect(parseGraphvizPos(undefined)).toEqual([{x: 0, y: 0}]);
    expect(parseGraphvizPos("")).toEqual([{x: 0, y: 0}]);
    expect(parseGraphvizPos("0,0")).toEqual([{x: 0, y: 0}]);
    expect(parseGraphvizPos("e,27,36.104 27,71.697")).toEqual([{x: 27, y: 36.104}, {x: 27, y: 71.697}]);
    expect(parseGraphvizPos("s,27,36.104 27,71.697")).toEqual([{x: 27, y: 36.104}, {x: 27, y: 71.697}]);
  });

  it('compare items', () => {
    const importer = new DotImporter(`digraph {
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

  it('edge with', async () => {
    const source = `digraph {
  node [shape=box style=filled];
  a -> b;
}
`;

    const output = await graphvizSync().then((graph) => {
      return graph.layout(source, "json")
    });

    const structure = JSON.parse(output);

    console.log(JSON.stringify(GraphvizToGim(structure)));
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
