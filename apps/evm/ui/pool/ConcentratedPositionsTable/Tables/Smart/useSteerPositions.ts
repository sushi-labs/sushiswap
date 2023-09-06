'use client'

import { ChainId } from '@sushiswap/chain'
import { usePool, useSteerVaults } from '@sushiswap/client/hooks'
import { Amount, Token } from '@sushiswap/currency'
import { useAllPrices } from '@sushiswap/react-query'
import { useSteerAccountPositions } from '@sushiswap/steer-sdk/hooks'
import { Address, useAccount } from '@sushiswap/wagmi'
import { useMemo } from 'react'

interface UseSteerPositions {
  chainId?: ChainId
  poolAddress?: Address
}

export const useSteerPositions = ({ poolAddress, chainId }: UseSteerPositions) => {
  const { address } = useAccount()

  const { data: vaultsPerChain, isLoading: isPerChainLoading } = useSteerVaults({
    args: { chainIds: chainId ? [chainId] : undefined },
    shouldFetch: !poolAddress || !chainId,
  })
  const { data: vaultsPerPool, isLoading: isPerPoolLoading } = usePool({
    args: chainId && poolAddress ? { chainId, address: poolAddress } : '',
    shouldFetch: !!poolAddress && !!chainId,
  })

  const { data: prices, isLoading: isPricesLoading } = useAllPrices()

  const isVaultsLoading = isPerChainLoading || isPerPoolLoading
  const vaults = useMemo(() => {
    if (vaultsPerChain) {
      return vaultsPerChain
    }

    if (vaultsPerPool) {
      return vaultsPerPool.steerVaults.map((steerVault) => ({ ...steerVault, pool: vaultsPerPool }))
    }
  }, [vaultsPerChain, vaultsPerPool])

  const vaultIds = useMemo(() => vaults?.map((el) => el.id), [vaults])
  const { data: positions, isLoading: isPositionsLoading } = useSteerAccountPositions({ vaultIds, account: address })

  return {
    data: useMemo(() => {
      if (!vaults || !positions) return []

      return positions
        ?.filter((position) => position?.steerTokenBalance !== 0n)
        .flatMap((el, i) => {
          if (!el) return []

          const vault = vaults[i]

          const token0 = new Token({ chainId: vault.chainId, ...vault.token0 })
          const token1 = new Token({ chainId: vault.chainId, ...vault.token1 })

          const token0Price = prices?.[String(vault.chainId)]?.[vault.token0.address] || 0
          const token1Price = prices?.[String(vault.chainId)]?.[vault.token1.address] || 0

          const token0Amount = Amount.fromRawAmount(token0, el?.token0Balance)
          const token1Amount = Amount.fromRawAmount(token1, el?.token1Balance)

          return {
            ...el,
            vault,
            token0Amount,
            token1Amount,
            token0AmountUSD: Number(token0Amount?.multiply(token0Price).toSignificant(8)),
            token1AmountUSD: Number(token1Amount?.multiply(token1Price).toSignificant(8)),
          }
        })
    }, [positions, prices, vaults]),
    isLoading: isVaultsLoading || isPricesLoading || isPositionsLoading,
  }
}

export type SteerPosition = NonNullable<ReturnType<typeof useSteerPositions>['data']>[number]
