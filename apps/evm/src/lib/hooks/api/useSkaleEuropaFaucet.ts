'use client'

import { publicWagmiConfig } from '@sushiswap/wagmi-config'
import { useQuery } from '@tanstack/react-query'
import { createConfig, getBalance } from '@wagmi/core'
import { ChainId } from 'sushi/chain'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

const MAX_BALANCE_AMOUNT = 100000000000n // '0.0000001'

export const useSkaleEuropaFaucet = () => {
  const { address, chainId } = useAccount()

  return useQuery({
    queryKey: ['useSkaleEuropaFaucet', address],
    queryFn: async () => {
      const config = createConfig(publicWagmiConfig)

      const balance = await getBalance(config, {
        chainId: ChainId.SKALE_EUROPA,
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
    staleTime: Infinity,
    enabled: Boolean(chainId === ChainId.SKALE_EUROPA && address),
  })
}
