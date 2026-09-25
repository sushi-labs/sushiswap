import type { EvmAddress, SushiSwapV3ChainId } from 'sushi/evm'
import { readContracts } from 'wagmi/actions'
import type { PublicWagmiConfig } from '../../../config/public'
import { getPositionManager } from '../../positions/position-manager'

export const getConcentratedPositionOwners = async ({
  tokenIds,
  config,
}: {
  tokenIds: {
    chainId: SushiSwapV3ChainId
    tokenId: bigint
    positionManager?: EvmAddress
  }[]
  config: PublicWagmiConfig
}) => {
  return readContracts(config, {
    contracts: tokenIds.map(
      ({ tokenId, chainId, positionManager }) =>
        ({
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
          args: [tokenId ?? 0n],
        }) as const,
    ),
  })
}
