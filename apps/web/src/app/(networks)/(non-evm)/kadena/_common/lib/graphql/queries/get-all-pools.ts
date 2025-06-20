export const getAllPools = ({
  first = 50,
  orderBy = 'TVL_USD_DESC',
  after = null,
}: {
  first?: number
  orderBy?: string
  after?: string | null
}) => {
  return JSON.stringify({
    query: `
      query GetPools($first: Int, $orderBy: PoolOrderBy = TVL_USD_DESC, $after: String) {
        pools(first: $first, orderBy: $orderBy, after: $after) {
          edges {
            node {
              id
              address
              token0 { id name chainId address }  
              token1 { id name chainId address }
              tvlUsd
              volume24hUsd
              volume7dUsd
              transactionCount24h
              apr24h
              fees24hUsd
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
          totalCount
        }
      }
    `,
    variables: {
      first,
      orderBy,
      after,
    },
  })
}
