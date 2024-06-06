import type { VariablesOf } from 'gql.tada'

import { STEER_SUBGRAPH_URL, type SteerChainId } from '@sushiswap/steer-sdk'
import { requestPaged } from 'src/lib/request-paged'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import { type Address, SushiSwapProtocol, getIdFromChainIdAddress } from 'sushi'
import type { SushiSwapV3ChainId } from 'sushi/config'
import { graphql } from '../graphql'

export const SteerVaultsQuery = graphql(`
  query Vaults($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: Vault_orderBy, $orderDirection: OrderDirection, $where: Vault_filter) {
    vaults(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      feeTier
      reserve0: token0Balance
      reserve1: token1Balance
      pool
      state
      payloadIpfs
      strategyToken {
        id
        name

        creator {
          id
        }
        admin
      }

      lowestPosition: positions(first: 1, orderBy: lowerTick, orderDirection: asc) {
        lowerTick
      }
      uppestPosition: positions(first: 1, orderBy: upperTick, orderDirection: desc) {
        upperTick
      }
      

      createdAt
      token0
      token1
      fees0
      fees1

      manager: vaultManager
    }
  }
`)

export type GetSteerVaults = VariablesOf<typeof SteerVaultsQuery> &
  ChainIdVariable<SteerChainId>

export async function getSteerVaults({
  chainId,
  ...variables
}: GetSteerVaults) {
  const url = `https://${STEER_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SteerVaultsQuery,
    variables,
  })

  return result.vaults.map((vault) => ({
    id: getIdFromChainIdAddress(chainId, vault.id as Address),
    chainId: chainId as SteerChainId,
    address: vault.id as Address,

    feeTier: Number(vault.feeTier),

    reserve0: BigInt(vault.reserve0),
    reserve1: BigInt(vault.reserve1),

    pool: {
      id: getIdFromChainIdAddress(chainId, vault.pool as Address),
      address: vault.pool as Address,
      chainId: chainId as SushiSwapV3ChainId,
      protocol: SushiSwapProtocol.SUSHISWAP_V3,
    },

    state: vault.state,
    payloadIpfs: vault.payloadIpfs,
    strategyToken: {
      id: vault.strategyToken.id,
      name: vault.strategyToken.name,
      creator: {
        id: vault.strategyToken.creator.id,
      },
      admin: vault.strategyToken.admin,
    },

    lowerTick: vault.lowestPosition[0]
      ? BigInt(vault.lowestPosition[0]?.lowerTick[0] || 0)
      : null,
    upperTick: vault.uppestPosition[0]
      ? BigInt(vault.uppestPosition[0]?.upperTick[0] || 0)
      : null,

    token0: {
      id: getIdFromChainIdAddress(chainId, vault.token0 as Address),
      chainId: chainId as SushiSwapV3ChainId,
      address: vault.token0 as Address,
    },
    token1: {
      id: getIdFromChainIdAddress(chainId, vault.token1 as Address),
      chainId: chainId as SushiSwapV3ChainId,
      address: vault.token1 as Address,
    },

    fees0: BigInt(vault.fees0),
    fees1: BigInt(vault.fees1),

    manager: vault.manager,
  }))
}

export type SteerVaults = Awaited<ReturnType<typeof getSteerVaults>>
