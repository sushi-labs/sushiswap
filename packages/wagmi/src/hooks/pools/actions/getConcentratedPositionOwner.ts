import { SushiSwapV3ChainId } from 'sushi/config'
import { Address, readContracts } from 'wagmi'

import { getV3NonFungiblePositionManagerConractConfig } from '../../contracts/useV3NonFungiblePositionManager'

export const getConcentratedPositionOwners = async ({
  tokenIds,
}: {
  tokenIds: { chainId: SushiSwapV3ChainId; tokenId: bigint }[]
}) => {
  return readContracts({
    contracts: tokenIds.map(
      ({ tokenId, chainId }) =>
        ({
          chainId,
          address: getV3NonFungiblePositionManagerConractConfig(chainId)
            .address as Address,
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
          args: [tokenId ?? 0n],
        }) as const,
    ),
  })
}
