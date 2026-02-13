import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import type { EvmID } from 'sushi/evm'
import type { Address } from 'viem'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'
import type { SmartPoolChainId } from '../../types/SmartPoolChainId.js'

export const VaultQuery = graphql(
  `
  query Vault($chainId: SmartPoolChainId!, $vaultAddress: Bytes!) {
    vault(chainId: $chainId, vaultAddress: $vaultAddress) {
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

export type GetVault = VariablesOf<typeof VaultQuery>

export async function getVault(variables: GetVault, options?: RequestOptions) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  try {
    const result = await request(
      {
        url,
        document: VaultQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result) {
      const vault = result.vault
      return {
        ...vault,
        chainId: vault.chainId as SmartPoolChainId,
        id: vault.id as EvmID,
        address: vault.address as Address,
        reserve0: BigInt(vault.reserve0),
        reserve1: BigInt(vault.reserve1),
        fees0: BigInt(vault.fees0),
        fees1: BigInt(vault.fees1),
        token0: {
          ...vault.token0,
          id: `${vault.chainId}:${vault.token0.address}` as EvmID,
          address: vault.token0.address as Address,
          chainId: vault.chainId as SmartPoolChainId,
        },
        token1: {
          ...vault.token1,
          id: `${vault.chainId}:${vault.token1.address}` as EvmID,
          address: vault.token1.address as Address,
          chainId: vault.chainId as SmartPoolChainId,
        },
      }
    }

    throw new Error('No vault found')
  } catch {
    return null
  }
}

export type VaultV1 = NonNullable<Awaited<ReturnType<typeof getVault>>>
