import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'

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
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    { url, document: PortfolioClaimablesQuery, variables },
    options,
  )
  if (result) {
    return result.portfolioClaimables
  }

  throw new Error('No portfolio positions')
}

export type PortfolioClaimables = Awaited<
  ReturnType<typeof getPortfolioClaimables>
>

export type PortfolioV2Claim = PortfolioClaimables['v2PositionClaimables'][0]
export type PortfolioV3Claim = PortfolioClaimables['v3PositionClaimables'][0]
export type PortfolioFuroClaim = PortfolioClaimables['furoClaimables'][0]

export type PortfolioFarmClaim = PortfolioV2Claim | PortfolioV3Claim

export type PortfolioClaim = PortfolioFarmClaim | PortfolioFuroClaim
