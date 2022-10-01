import { useMemo } from 'react'
import { useProvider } from 'wagmi'
import { getContract, GetContractArgs } from 'wagmi/actions'

export const getRewarderConfig = (addressOrName: string): GetContractArgs => {
  return {
    addressOrName,
    contractInterface: [
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
    ],
  }
}

export function useRewarderContract(chainId: number, addressOrName: string | undefined) {
  const provider = useProvider({ chainId })
  return useMemo(() => {
    if (!addressOrName) return undefined
    return getContract({
      ...getRewarderConfig(addressOrName),
      signerOrProvider: provider,
    })
  }, [addressOrName, provider])
}
