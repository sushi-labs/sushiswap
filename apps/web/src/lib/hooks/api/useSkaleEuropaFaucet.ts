'use client'

import { useQuery } from '@tanstack/react-query'
import { createConfig, getBalance } from '@wagmi/core'
import { EvmChainId } from 'sushi/evm'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'
import { publicWagmiConfig } from '../../wagmi/config/public'

const MAX_BALANCE_AMOUNT = 100000000000n // '0.0000001'

export const useSkaleEuropaFaucet = () => {
  const { address, chainId } = useAccount()

  return useQuery({
    queryKey: ['useSkaleEuropaFaucet', address],
    queryFn: async () => {
      const config = createConfig(publicWagmiConfig)

      const balance = await getBalance(config, {
        chainId: EvmChainId.SKALE_EUROPA,
        address: address as Address,
      })

      if (balance.value > MAX_BALANCE_AMOUNT) return false

      const response = await fetch(`/api/faucet/skale-europa/${address}`)

      const json = await response.json()

      if (json.status !== 200) {
        throw new Error(json)
      }

      return true
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: Boolean(chainId === EvmChainId.SKALE_EUROPA && address),
  })
}
