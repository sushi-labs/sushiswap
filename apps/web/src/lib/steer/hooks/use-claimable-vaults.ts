'use client'

import type { SmartPoolChainId } from '@sushiswap/graph-client/data-api'
import { getSmartPools } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { readContracts } from '@wagmi/core'
import { Amount } from 'sushi'
import { EvmToken } from 'sushi/evm'
import type { Address } from 'viem'
import { useConfig } from 'wagmi'
import { useMultiChainPrices } from '~evm/_common/ui/price-provider/price-provider/use-multi-chain-prices'
import { steerVaultFeesAbi } from '../abi/steer-vault-fees'

const FEE_IDENTIFIER = 'STRATEGIST_FEES'

export interface VaultWithFees {
  vaultId: string
  address: Address
  chainId: SmartPoolChainId
  token0: EvmToken
  token1: EvmToken
  amount0: bigint
  amount1: bigint
  amount0USD: number
  amount1USD: number
  totalUSD: number
  swapFee: number
  tvlUSD: number
}

export interface ChainVaultData {
  chainId: SmartPoolChainId
  vaults: VaultWithFees[]
  totalUSD: number
}

interface UseClaimableVaultsParams {
  chainIds: readonly SmartPoolChainId[]
  enabled?: boolean
}

export function useClaimableVaults({
  chainIds,
  enabled = true,
}: UseClaimableVaultsParams) {
  const config = useConfig()

  const {
    data: prices,
    isError: isPriceError,
    isLoading: isPriceInitialLoading,
  } = useMultiChainPrices({
    chainIds,
    enabled: enabled && chainIds.length > 0,
  })

  const {
    data: chainData,
    isError: isVaultsError,
    isLoading: isVaultsInitialLoading,
  } = useQuery({
    queryKey: ['useClaimableVaults', { chainIds, prices }],
    queryFn: async () => {
      const results: ChainVaultData[] = []

      await Promise.all(
        chainIds.map(async (chainId) => {
          const smartPools = await getSmartPools({ chainId })

          if (!smartPools || smartPools.length === 0) return

          const vaultAddresses = smartPools.map((v) => v.address)

          const contracts = vaultAddresses.flatMap((vault) => [
            {
              address: vault,
              abi: steerVaultFeesAbi,
              functionName: 'accruedFees0' as const,
              args: [FEE_IDENTIFIER] as const,
              chainId,
            },
            {
              address: vault,
              abi: steerVaultFeesAbi,
              functionName: 'accruedFees1' as const,
              args: [FEE_IDENTIFIER] as const,
              chainId,
            },
          ])

          const feesData = await readContracts(config, { contracts })

          const vaultsWithFees: VaultWithFees[] = []
          let totalUSD = 0

          for (let i = 0; i < smartPools.length; i++) {
            const vault = smartPools[i]
            const amount0Result = feesData[i * 2]
            const amount1Result = feesData[i * 2 + 1]

            if (
              typeof amount0Result?.result !== 'bigint' ||
              typeof amount1Result?.result !== 'bigint'
            ) {
              continue
            }

            const amount0 = amount0Result.result
            const amount1 = amount1Result.result

            if (amount0 === 0n && amount1 === 0n) continue

            const token0 = new EvmToken({
              chainId,
              address: vault.token0.address,
              decimals: vault.token0.decimals,
              symbol: vault.token0.symbol,
              name: vault.token0.name ?? vault.token0.symbol,
            })

            const token1 = new EvmToken({
              chainId,
              address: vault.token1.address,
              decimals: vault.token1.decimals,
              symbol: vault.token1.symbol,
              name: vault.token1.name ?? vault.token1.symbol,
            })

            const price0Fraction = prices
              ?.get(chainId)
              ?.getFraction(token0.wrap().address)
            const price1Fraction = prices
              ?.get(chainId)
              ?.getFraction(token1.wrap().address)

            const amount0Obj = new Amount(token0, amount0)
            const amount1Obj = new Amount(token1, amount1)

            const amount0USD = price0Fraction
              ? +amount0Obj.mul(price0Fraction).toString()
              : 0
            const amount1USD = price1Fraction
              ? +amount1Obj.mul(price1Fraction).toString()
              : 0

            const vaultTotalUSD = amount0USD + amount1USD
            totalUSD += vaultTotalUSD

            vaultsWithFees.push({
              vaultId: vault.id,
              address: vault.address,
              chainId,
              token0,
              token1,
              amount0,
              amount1,
              amount0USD,
              amount1USD,
              totalUSD: vaultTotalUSD,
              swapFee: vault.swapFee,
              tvlUSD: vault.vaultLiquidityUSD,
            })
          }

          if (vaultsWithFees.length > 0) {
            results.push({
              chainId,
              vaults: vaultsWithFees,
              totalUSD,
            })
          }
        }),
      )

      return results
    },
    enabled:
      enabled &&
      chainIds.length > 0 &&
      (!isPriceInitialLoading || isPriceError),
  })

  return {
    data: chainData,
    isError: isVaultsError || isPriceError,
    isLoading: isVaultsInitialLoading || isPriceInitialLoading,
  }
}
