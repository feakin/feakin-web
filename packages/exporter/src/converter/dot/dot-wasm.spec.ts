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

    console.log(output);
  });
});
