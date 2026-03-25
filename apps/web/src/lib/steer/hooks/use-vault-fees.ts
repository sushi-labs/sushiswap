'use client'

import { useMemo } from 'react'
import { useReadContracts } from 'wagmi'
import type { Address } from 'viem'
import type { SmartPoolChainId } from '@sushiswap/graph-client/data-api'
import { SmartPoolChainIds } from '@sushiswap/graph-client/data-api'
import { steerVaultFeesAbi } from '../abi/steer-vault-fees'

const FEE_IDENTIFIER = 'STRATEGIST_FEES'

interface VaultFee {
  vaultAddress: Address
  chainId: SmartPoolChainId
  amount0: bigint
  amount1: bigint
}

interface UseVaultFeesParams {
  vaults: { address: Address; chainId: SmartPoolChainId }[] | undefined
  enabled?: boolean
}

export function useVaultFees({ vaults, enabled = true }: UseVaultFeesParams) {
  const contracts = useMemo(() => {
    if (!vaults || vaults.length === 0) return undefined

    return vaults.flatMap((vault) => [
      {
        address: vault.address,
        abi: steerVaultFeesAbi,
        functionName: 'accruedFees0' as const,
        args: [FEE_IDENTIFIER] as const,
        chainId: vault.chainId,
      },
      {
        address: vault.address,
        abi: steerVaultFeesAbi,
        functionName: 'accruedFees1' as const,
        args: [FEE_IDENTIFIER] as const,
        chainId: vault.chainId,
      },
    ])
  }, [vaults])

  const { data, isLoading, isError } = useReadContracts({
    contracts,
    query: {
      enabled: Boolean(enabled && vaults && vaults.length > 0),
    },
  })

  const vaultFees = useMemo(() => {
    if (!data || !vaults) return undefined

    const result: VaultFee[] = []

    for (let i = 0; i < vaults.length; i++) {
      const vault = vaults[i]
      const amount0Result = data[i * 2]
      const amount1Result = data[i * 2 + 1]

      if (
        typeof amount0Result?.result === 'bigint' &&
        typeof amount1Result?.result === 'bigint'
      ) {
        result.push({
          vaultAddress: vault.address,
          chainId: vault.chainId,
          amount0: amount0Result.result,
          amount1: amount1Result.result,
        })
      }
    }

    return result
  }, [data, vaults])

  return {
    data: vaultFees,
    isLoading,
    isError,
  }
}
