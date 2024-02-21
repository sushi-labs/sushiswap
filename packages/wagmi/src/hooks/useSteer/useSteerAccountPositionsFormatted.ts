import { getSteerAccountPositions } from '@sushiswap/steer-sdk'
import { useQuery } from '@tanstack/react-query'
import { Address, usePublicClient } from 'wagmi'

import { getSteerVaults } from '@sushiswap/client'
import { useAllPrices } from '@sushiswap/react-query'
import { Amount, Token } from 'sushi/currency'
import { PublicClient } from 'viem'
import { clientsFromIds } from './getClientsFromIds'

import { STEER_ENABLED_NETWORKS } from '@sushiswap/graph-config'

interface UseSteerAccountPositionsFormatted {
  account: Address | undefined
  enabled?: boolean
  chainIds?: number[]
}

export const useSteerAccountPositionsFormatted = ({
  account,
  enabled = true,
  chainIds = [...STEER_ENABLED_NETWORKS],
}: UseSteerAccountPositionsFormatted) => {
  const client = usePublicClient()
  const { data: prices } = useAllPrices()

  return useQuery({
    queryKey: ['useSteerAccountPositions', { account, client }],
    queryFn: async () => {
      if (!account) return null

      const vaults = await getSteerVaults({
        chainIds: STEER_ENABLED_NETWORKS as unknown as number[],
        orderBy: 'reserveUSD',
        orderDir: 'desc',
        onlyEnabled: false,
      })

      const vaultIds = vaults.map((el) => el.id)

      const data = await getSteerAccountPositions({
        clients: clientsFromIds(vaultIds) as PublicClient[],
        account,
        vaultIds: vaultIds,
      })

      return data
        .map((el, i) => {
          if (!el || el?.steerTokenBalance <= 0n) return null

          const vault = vaults[i]

          const token0 = new Token({ chainId: vault.chainId, ...vault.token0 })
          const token1 = new Token({ chainId: vault.chainId, ...vault.token1 })

          const token0Price =
            prices?.[String(vault.chainId)]?.[token0.address] || 0
          const token1Price =
            prices?.[String(vault.chainId)]?.[token1.address] || 0

          const token0Amount = Amount.fromRawAmount(token0, el?.token0Balance)
          const token1Amount = Amount.fromRawAmount(token1, el?.token1Balance)

          const token0AmountUSD = Number(
            token0Amount?.multiply(token0Price).toSignificant(8),
          )
          const token1AmountUSD = Number(
            token1Amount?.multiply(token1Price).toSignificant(8),
          )

          return {
            ...el,
            vault,
            token0Amount,
            token1Amount,
            token0AmountUSD,
            token1AmountUSD,
            totalAmountUSD: token0AmountUSD + token1AmountUSD,
          }
        })
        .filter((el) => Boolean(el))
    },
    refetchInterval: 10000,
    enabled: Boolean(enabled && account && prices),
    select: (data) => {
      if (!data) return null
      return data.filter((el) => (el ? chainIds.includes(el.chainId) : null))
    },
  })
}
