export const getWalletPositionsQuery = `
      query GetWalletPositions($walletAddress: String!) {
        liquidityPositions(walletAddress: $walletAddress, orderBy: VALUE_USD_DESC, first: 10) {
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
    `
