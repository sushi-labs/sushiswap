import { SUSHISWAP_V3_TICK_LENS, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { getContract } from '@wagmi/core'
import { useMemo } from 'react'
import { Address, usePublicClient } from 'wagmi'

export const getV3TickLensContractConfig = (chainId: SushiSwapV3ChainId) => ({
  address: SUSHISWAP_V3_TICK_LENS[chainId] as Address,
  abi: [
    {
      inputs: [
        { internalType: 'address', name: 'pool', type: 'address' },
        { internalType: 'int16', name: 'tickBitmapIndex', type: 'int16' },
      ],
      name: 'getPopulatedTicksInWord',
      outputs: [
        {
          components: [
            { internalType: 'int24', name: 'tick', type: 'int24' },
            { internalType: 'int128', name: 'liquidityNet', type: 'int128' },
            { internalType: 'uint128', name: 'liquidityGross', type: 'uint128' },
          ],
          internalType: 'struct ITickLens.PopulatedTick[]',
          name: 'populatedTicks',
          type: 'tuple[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ] as const,
})

export function useTickLensContract(chainId: SushiSwapV3ChainId | undefined) {
  const publicClient = usePublicClient({ chainId })

  return useMemo(() => {
    if (!chainId) return null

    return getContract({ ...getV3TickLensContractConfig(chainId), walletClient: publicClient })
  }, [chainId, publicClient])
}
