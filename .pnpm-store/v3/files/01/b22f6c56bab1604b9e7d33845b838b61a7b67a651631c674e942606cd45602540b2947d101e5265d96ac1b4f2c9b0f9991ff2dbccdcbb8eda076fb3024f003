## Automatic Unlimited Pagination

`graph-client` implements automatic pagination using `first:` and `after:` filters of `graph-node`.

At the moment, `graph-node` allow fetching only 1000 records per query. This transfomer allow you to run queries with any limit, and the breaks it automatically to multiple concurrent requests, then merges the responses into a single response.

This feature is implemented in `@graphprotocol/client-auto-pagination` and installed automatically with the `graph-client` CLI package.

### Usage Example

```yaml
# .graphclientrc.yml
sources:
  - name: uniswap
    handler:
      graphql:
        endpoint: https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2
    transforms:
      - autoPagination:
          validateSchema: true # Validates that the schema source actually contains the required input filters.
          limitOfRecords: 1000 # Default is 1000, you can change if you indexer has different configuration in GRAPH_GRAPHQL_MAX_FIRST var.
```
