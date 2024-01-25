import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { useContractRead } from 'wagmi'

import { getV3NonFungiblePositionManagerContractConfig } from '../../contracts/useV3NonFungiblePositionManager'

export const useConcentratedPositionOwner = ({
  chainId,
  tokenId,
}: {
  chainId: SushiSwapV3ChainId
  tokenId: number | string | undefined
}) => {
  return useContractRead({
    chainId,
    address: getV3NonFungiblePositionManagerContractConfig(chainId).address,
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
    ] as const,
    functionName: 'ownerOf',
    args: [BigInt(tokenId ? tokenId : 0)],
    enabled: Boolean(chainId) && Boolean(tokenId),
  } as const)
}
