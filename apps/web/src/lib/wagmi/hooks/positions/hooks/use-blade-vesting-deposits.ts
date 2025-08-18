import type { BladeChainId } from 'sushi/config'
import type { Address } from 'viem'
import { useReadContract } from 'wagmi'

export const useBladeVestingDeposits = ({
  contractAddress,
  account,
  chainId,
}: {
  contractAddress?: Address
  account?: Address
  chainId?: BladeChainId
}) => {
  const query = useReadContract({
    chainId,
    address: contractAddress,
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'user',
            type: 'address',
          },
        ],
        name: 'vestingDeposits',
        outputs: [
          {
            internalType: 'uint256',
            name: 'lockedUntil',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'poolTokenAmount',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ] as const,
    functionName: 'vestingDeposits',
    args: [account ? account : '0x0000000000000000000000000000000000000000'],
    query: {
      enabled: Boolean(chainId && account && contractAddress),
    },
  } as const)

  return query
}
