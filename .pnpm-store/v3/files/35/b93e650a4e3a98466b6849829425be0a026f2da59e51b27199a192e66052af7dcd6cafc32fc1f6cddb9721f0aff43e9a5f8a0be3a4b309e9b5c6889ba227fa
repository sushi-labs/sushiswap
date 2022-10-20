## Automatic Block Tracking

`graph-client` implements automatic block tracking using `number_gte` filter of `graph-node`. This automates the process [of fetching and tracking the block number of entites](https://thegraph.com/docs/en/developer/distributed-systems/#polling-for-updated-data).

This feature is implemented in `@graphprotocol/client-block-tracking` and installed automatically with the `graph-client` CLI package.

### Usage Example

```yaml
# .graphclientrc.yml
sources:
  - name: uniswap
    handler:
      graphql:
        endpoint: https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2
    transforms: # The following section will make sure to automatically fetch the block information, and then use it for tracking in future queries.
      - blockTracking:
          validateSchema: true # Validates that the schema source actually contains _meta and input block filters.
```
