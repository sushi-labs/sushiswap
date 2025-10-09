import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_REQUEST_HEADERS } from '../../../data-api/request-headers.js'
import { graphql } from '../../graphql.js'

export const PortfolioV2PnLQuery = graphql(`
  query PortfolioV2PnL(
    $address: Bytes!,
    $chainId: PnLHistoryChainId!,
    $assets: [Bytes!]!
  ) {
    portfolioV2PnL(address: $address, chainId: $chainId, assets: $assets) {
      assets {
        address
        uPnL
        sparklineBalanceUSD30d {
          timestamp
          balanceUSD
        }
      }
    }
  }
`)

export type GetPortfolioV2PnL = VariablesOf<typeof PortfolioV2PnLQuery>

export async function getPortfolioV2PnL(
  variables: GetPortfolioV2PnL,
  options?: RequestOptions,
) {
  // const url = `${SUSHI_DATA_API_HOST}/graphql`
  const url = 'https://data-api-feat-portfolio2.data-gcp.sushi.com/graphql'

  try {
    const result = await request(
      {
        url,
        document: PortfolioV2PnLQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    return result.portfolioV2PnL
  } catch (error) {
    console.error('getPortfolioV2PnL error', error)
    throw new Error('getPortfolioV2PnL error')
  }
}

export type PortfolioV2PnLResponse = Awaited<
  ReturnType<typeof getPortfolioV2PnL>
>
export type PortfolioV2PnLAsset = PortfolioV2PnLResponse['assets'][number]
