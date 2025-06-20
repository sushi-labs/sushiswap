export const getWalletPositionsQuery = ({
  walletAddress,
  first = 10,
  after = null,
}: {
  walletAddress: string
  first?: number
  after?: string | null
}) => {
  return JSON.stringify({
    query: `
      query GetWalletPositions($walletAddress: String!, $first: Int = 10, $after: String) {
        liquidityPositions(walletAddress: $walletAddress, orderBy: VALUE_USD_DESC, first: $first, after: $after) {
          edges {
            node {
              id
              pairId
              pair {
                address
                id
                reserve0
                reserve1
                token0 {
                  address
                  chainId
                  id
                  name
                }
                token1 {
                  address
                  chainId
                  id
                  name
                }
                tvlUsd
                totalSupply
              }
              liquidity
              valueUsd
              apr24h
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
      walletAddress,
      first,
      after,
    },
  })
}
