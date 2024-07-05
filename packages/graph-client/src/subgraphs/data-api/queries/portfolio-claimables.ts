import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request'
import { graphql } from '../graphql'

export const PortfolioClaimablesQuery = graphql(
  `
    query PortfolioClaimables($id: ID!) {
      portfolioClaimables(id: $id) {
        totalUSD
        v2PositionClaimables {
          position {
            id
            chainId
            chain
            protocol
            protocolId
            protocolLogoUrl
            address
            name
            swapFee
            token0 {
              id
              chain
              chainId
              name
              symbol
              decimals
              logoUrl
              protocolId
              price
              isVerified
              isCore
              isWallet
              timeAt
              amount
              amountUSD
            }
            token1 {
              id
              chain
              chainId
              name
              symbol
              decimals
              logoUrl
              protocolId
              price
              isVerified
              isCore
              isWallet
              timeAt
              amount
              amountUSD
            }
            amountUSD
            updatedAt
          }
          token {
            id
            chain
            chainId
            name
            symbol
            decimals
            logoUrl
            protocolId
            price
            isVerified
            isCore
            isWallet
            timeAt
            amount
            amountUSD
          }
        }
        v3PositionClaimables {
          position {
            id
            chainId
            chain
            protocol
            protocolId
            protocolLogoUrl
            address
            name
            swapFee
            positionId
            range
            fees {
              id
              chain
              chainId
              name
              symbol
              decimals
              logoUrl
              protocolId
              price
              isVerified
              isCore
              isWallet
              timeAt
              amount
              amountUSD
            }
            amountUSD
            updatedAt
          }
        }
        smartPositionClaimables {
                token {
            id
            chain
            chainId
            name
            symbol
            decimals
            logoUrl
            protocolId
            price
            isVerified
            isCore
            isWallet
            timeAt
            amount
            amountUSD
          }
          position {
            id
            chainId
            chain
            protocol
            protocolId
            protocolLogoUrl
            address
            name
            vaultAddress
            swapFee
            strategy
            amountUSD
            updatedAt
          }
        }
        furoClaimables {
          position {
            id
            chainId
            chain
            protocol
            protocolId
            protocolLogoUrl
            address
            name
            positionId
            updatedAt
          }
          token {
            id
            chain
            chainId
            name
            symbol
            decimals
            logoUrl
            protocolId
            price
            isVerified
            isCore
            isWallet
            timeAt
            amount
            amountUSD
          }
        }
      }
    }
`,
)

export type GetPortfolioClaimables = VariablesOf<
  typeof PortfolioClaimablesQuery
>

export async function getPortfolioClaimables(
  variables: GetPortfolioClaimables,
  options?: RequestOptions,
) {
  const url = `https://data-api-production-acb1.up.railway.app/graphql/`

  const result = await request(
    { url, document: PortfolioClaimablesQuery, variables },
    options,
  )
  if (result) {
    return result.portfolioClaimables
  }

  throw new Error('No portfolio positions')
}

export type PortfolioPositions = Awaited<
  ReturnType<typeof getPortfolioClaimables>
>

export type PortfolioV2Claim = PortfolioPositions['v2PositionClaimables'][0]
export type PortfolioV3Claim = PortfolioPositions['v3PositionClaimables'][0]
export type PortfolioSmartPositionClaim = PortfolioPositions['smartPositionClaimables'][0]
export type PortfolioFuroClaim = PortfolioPositions['furoClaimables'][0]

export type PortfolioClaim = PortfolioV2Claim['position'] | PortfolioV3Claim['position'] | PortfolioSmartPositionClaim['position'] | PortfolioFuroClaim['position']
