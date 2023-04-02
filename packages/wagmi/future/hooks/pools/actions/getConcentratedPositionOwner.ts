import { BigNumber } from 'ethers'
import { readContracts } from 'wagmi'
import { ChainId } from '@sushiswap/chain'

export const getConcentratedPositionOwners = async ({
  tokenIds,
}: {
  tokenIds: { chainId: ChainId; tokenId: BigNumber }[]
}) => {
  return readContracts({
    contracts: tokenIds.map(
      ({ tokenId, chainId }) =>
        ({
          chainId,
          address: '0xF0cBce1942A68BEB3d1b73F0dd86C8DCc363eF49',
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
        } as const)
    ),
  })
}
