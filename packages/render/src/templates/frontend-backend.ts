export const frontendBackendTemplates = [
  {
    name: 'frontend-backend',
    label: 'Frontend-Backend',
    template: `digraph {
  compound=true;
  node [ fontname="Handlee" ];
  subgraph cluster_website {
      label="*Website*";

      subgraph cluster_frontend {
          label="*Frontend*";
          React;
          Bootstrap;
      }

      subgraph cluster_backend {
          label="*Backend*";
          expressjs;
          "aws-sdk";
      }
  }

  subgraph cluster_aws {
      label="*AWS*";
      DynamoDb;
      S3;
  }

  React -> expressjs;
  expressjs -> "aws-sdk" [constraint=false];
  "aws-sdk" -> S3 [lhead=cluster_aws];
}
`
  }
]
