import { useMemo } from 'react'
import { Address, useProvider } from 'wagmi'
import { getContract } from 'wagmi/actions'

export const getRewarderConfig = (address: string) => {
  return {
    address: address as Address,
    abi: [
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'pid',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'user',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        name: 'pendingTokens',
        outputs: [
          {
            internalType: 'contract IERC20[]',
            name: 'rewardTokens',
            type: 'address[]',
          },
          {
            internalType: 'uint256[]',
            name: 'rewardAmounts',
            type: 'uint256[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ] as const,
  }
}

export function useRewarderContract(
  chainId: number,
  address: string | undefined
): ReturnType<typeof getContract> | undefined {
  const provider = useProvider({ chainId })
  return useMemo(() => {
    if (!address) return undefined
    return getContract({
      ...getRewarderConfig(address),
      signerOrProvider: provider,
    })
  }, [address, provider])
}
