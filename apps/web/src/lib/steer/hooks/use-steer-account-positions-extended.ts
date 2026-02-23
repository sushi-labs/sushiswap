import type { SmartPoolChainId } from '@sushiswap/graph-client/data-api'
import { useMemo } from 'react'
import { useAllPrices } from 'src/lib/hooks/react-query'
import { Amount, Fraction, type ID } from 'sushi'
import { EvmToken } from 'sushi/evm'
import type { Address } from 'viem'
import { useSmartPools } from './use-smart-pools'
import { useSteerAccountPositions } from './use-steer-account-position'

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
  const { data: prices, isLoading: isPricesLoading } = useAllPrices()

  const { data: smartPools, isLoading: isVaultsLoading } = useSmartPools(
    { chainId },
    Boolean(enabled && account),
  )

  const vaultIds = useMemo(
    () => smartPools?.map((el) => el.id) ?? [],
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

      const token0 = new EvmToken(vault.token0)
      const token1 = new EvmToken(vault.token1)

      const token0Price =
        prices?.get(vault.chainId)?.get(token0.address) || new Fraction(0)
      const token1Price =
        prices?.get(vault.chainId)?.get(token1.address) || new Fraction(0)

      const token0Amount = new Amount(token0, position.token0Balance)
      const token1Amount = new Amount(token1, position.token1Balance)

      const token0AmountUSD = Number(
        token0Amount?.mul(token0Price).toSignificant(8),
      )
      const token1AmountUSD = Number(
        token1Amount?.mul(token1Price).toSignificant(8),
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
