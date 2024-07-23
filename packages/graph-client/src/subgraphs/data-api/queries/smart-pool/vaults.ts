import type { SteerChainId } from '@sushiswap/steer-sdk'
import { SteerStrategy } from '@sushiswap/steer-sdk'
import type { VariablesOf } from 'gql.tada'
import { request, type RequestOptions } from 'src/lib/request'
import type { Address } from 'viem'
import { graphql } from '../../graphql'
import type { VaultV1 } from './vault'

export const VaultsQuery = graphql(
  `
  query Vaults($chainId: Int!, $poolAddress: String!) {
    vaults(chainId: $chainId, vaultAddress: $poolAddress) {
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
  const url = `https://data-api-production-acb1.up.railway.app/graphql/`

  const result = await request(
    { url, document: VaultsQuery, variables },
    options,
  )
  if (result.vaults) {
    const vaults = result.vaults.map((v) => {
      const strategy = SteerStrategy[v.strategy as keyof typeof SteerStrategy]
      if (!strategy) return null
      return {
        ...v,
        chainId: v.chainId as SteerChainId,
        id: `${v.chainId}:${v.id}` as `${string}:0x${string}`,
        address: v.address as Address,
        reserve0: BigInt(v.reserve0),
        reserve1: BigInt(v.reserve1),
        fees0: BigInt(v.fees0),
        fees1: BigInt(v.fees1),
        token0: {
          ...v.token0,
          id: `${v.chainId}:${v.token0.address}` as `${string}:0x${string}`,
          address: v.token0.address as Address,
          chainId: v.chainId as SteerChainId,
        },
        token1: {
          ...v.token1,
          id: `${v.chainId}:${v.token1.address}` as `${string}:0x${string}`,
          address: v.token1.address as Address,
          chainId: v.chainId as SteerChainId,
        },
        strategy,
      } satisfies VaultV1
    })

    return vaults.filter((v) => v !== null) as VaultV1[]
  }

  throw new Error('No smart pool found')
}

