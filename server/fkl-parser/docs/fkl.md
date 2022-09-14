# Feakin Language

| decl              |        | usage                                           |
|-------------------|--------|-------------------------------------------------|
| context_map_decl  | :      | [ 'ContextMap' ] [ ID ] '{' context_network '}' |
|                   | &#124; | attribute_list                                  |
| context_network   | :      | (context_node_decl &#124; context_node_rel )    |
| item              | :      | ID '=' ID [ (';' &#124; ',') ]                  |
| context_node_decl | :      | ['context'] [ID]                                |
| context_node_rel  | :      | [ ID ] rel_symbol [ ID ]                        |
| rel_symbol        | :      | ('->' &#124; '<-' &#124; '<->')                 |                      
| context_decl      | :      | [ 'Context' ] [ ID ] '{' aggregate_list? '}'    |
|                   | &#124; | attribute_list                                  |


| decl               |        | usage                                         |
|--------------------|--------|-----------------------------------------------|
| aggregate_decl     | :      | [ 'Aggregate' ]  [ ID ] '{' entity_list '}'   |
|                    | &#124; | attribute_list                                |
| entity_decl        | :      | [ 'Entity' ] [ ID ] '{' value_object_list '}' |
|                    | &#124; | attribute_list                                |
| value_object__decl | :      | [ 'ValueObject' ] [ ID ] '{' value_list '}'   |
|                    | &#124; | attribute_list                                |
