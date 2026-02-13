import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import type { EvmID } from 'sushi/evm'
import type { Address } from 'viem'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'
import type { SmartPoolChainId } from '../../types/SmartPoolChainId.js'
import type { VaultV1 } from './vault.js'

export const VaultsQuery = graphql(
  `
  query Vaults($chainId: SmartPoolChainId!, $poolAddress: Bytes!) {
    vaults(chainId: $chainId, poolAddress: $poolAddress) {
      id
      address
      chainId
      poolAddress
      feeTier
      performanceFee
      token0 {
        id
        address
        name
        symbol
        decimals
      }
      token1 {
        id
        address
        name
        symbol
        decimals
      }
      adjustmentFrequency
      lastAdjustmentTimestamp
      strategy
      description
      payloadHash
      lowerTick
      upperTick
      apr
      apr1d
      apr1w
      reserve0
      reserve0USD
      fees0
      fees0USD
      reserve1
      reserve1USD
      fees1
      fees1USD
      reserveUSD
      feesUSD
      feeApr1d
      feeAndIncentiveApr1d
      stakedApr1d
      stakedAndIncentiveApr1d
      incentiveApr
      wasIncentivized
      isIncentivized
      isEnabled
      wasEnabled
      isDeprecated
    }
  }
`,
)

export type GetVaults = VariablesOf<typeof VaultsQuery>

export async function getVaults(
  variables: GetVaults,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: VaultsQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  if (result.vaults) {
    const vaults = result.vaults.map((v) => {
      return {
        ...v,
        chainId: v.chainId as SmartPoolChainId,
        id: v.id as EvmID,
        address: v.address as Address,
        reserve0: BigInt(v.reserve0),
        reserve1: BigInt(v.reserve1),
        fees0: BigInt(v.fees0),
        fees1: BigInt(v.fees1),
        token0: {
          ...v.token0,
          id: `${v.chainId}:${v.token0.address}` as EvmID,
          address: v.token0.address as Address,
          chainId: v.chainId as SmartPoolChainId,
        },
        token1: {
          ...v.token1,
          id: `${v.chainId}:${v.token1.address}` as EvmID,
          address: v.token1.address as Address,
          chainId: v.chainId as SmartPoolChainId,
        },
      } satisfies VaultV1
    })

    return vaults.filter((v) => v !== null) as VaultV1[]
  }

  throw new Error('No smart pool found')
}
