import type { SmartPoolChainId } from '@sushiswap/graph-client/data-api'
import { useMemo } from 'react'
import { useSmartPools } from 'src/lib/hooks/api/userSmartPools'
import { useAllPrices } from 'src/lib/hooks/react-query'
import type { ID } from 'sushi'
import { Amount, Token } from 'sushi/currency'
import type { Address } from 'viem'
import { useSteerAccountPositions } from './useSteerAccountPosition'

interface UseSteerAccountPositionsExtended {
  account: Address | undefined
  enabled?: boolean
  chainId: SmartPoolChainId
}

export type SteerAccountPositionExtended = NonNullable<
  ReturnType<typeof useSteerAccountPositionsExtended>['data']
>[0]

export type SteerAccountPositionVault = NonNullable<
  ReturnType<typeof useSteerAccountPositionsExtended>['data']
>[0]['vault']

export const useSteerAccountPositionsExtended = ({
  account,
  enabled = true,
  chainId,
}: UseSteerAccountPositionsExtended) => {
  const { data: prices, isInitialLoading: isPricesLoading } = useAllPrices()

  const { data: smartPools, isLoading: isVaultsLoading } = useSmartPools(
    { chainId },
    Boolean(enabled && account),
  )

  const vaultIds = useMemo(
    () => smartPools?.map((el) => el.id as ID) ?? [],
    [smartPools],
  )

  const { data: positions, isLoading } = useSteerAccountPositions({
    account,
    vaultIds,
    enabled,
  })

  const data = useMemo(() => {
    if (!smartPools || !positions) return undefined

    return positions.flatMap((position) => {
      if (position.steerTokenBalance <= 0n) return []

      const vault = smartPools.find((vault) => vault.id === position.id)

      if (!vault) return []

      const token0 = new Token(vault.token0)
      const token1 = new Token(vault.token1)

      const token0Price = prices?.get(vault.chainId)?.get(token0.address) || 0
      const token1Price = prices?.get(vault.chainId)?.get(token1.address) || 0

      const token0Amount = Amount.fromRawAmount(token0, position.token0Balance)
      const token1Amount = Amount.fromRawAmount(token1, position.token1Balance)

      const token0AmountUSD = Number(
        token0Amount?.multiply(token0Price).toSignificant(8),
      )
      const token1AmountUSD = Number(
        token1Amount?.multiply(token1Price).toSignificant(8),
      )

      return {
        ...position,
        vault,
        token0,
        token1,
        token0Amount,
        token1Amount,
        token0AmountUSD,
        token1AmountUSD,
        totalAmountUSD: token0AmountUSD + token1AmountUSD,
      }
    })
  }, [smartPools, prices, positions])

  return {
    data,
    isLoading: isLoading || isVaultsLoading || isPricesLoading,
  }
}
