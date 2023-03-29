import { useContractRead } from 'wagmi'
import { BigNumber } from 'ethers'

// TODO Factory address
export const useConcentratedPositionOwner = ({ tokenId }: { tokenId: number | string | undefined }) => {
  return useContractRead({
    address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    abi: [
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'ownerOf',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'ownerOf',
    args: [BigNumber.from(tokenId ? tokenId : 0)],
    enabled: Boolean(tokenId),
  })
}
