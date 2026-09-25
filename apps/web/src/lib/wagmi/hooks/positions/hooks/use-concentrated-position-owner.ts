import type { EvmAddress, SushiSwapV3ChainId } from 'sushi/evm'
import { useReadContract } from 'wagmi'
import { getPositionManager } from '../position-manager'
import { parsePositionTokenId } from '../position-token-id'

export const useConcentratedPositionOwner = ({
  chainId,
  tokenId,
  positionManager,
}: {
  chainId: SushiSwapV3ChainId
  tokenId: number | string | undefined
  positionManager?: EvmAddress
}) => {
  const parsedTokenId = parsePositionTokenId(tokenId)

  const query = useReadContract({
    chainId,
    address: getPositionManager(chainId, positionManager),
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
    args: parsedTokenId ? [parsedTokenId] : undefined,
    query: {
      enabled: Boolean(chainId && parsedTokenId),
    },
  } as const)

  return query
}
