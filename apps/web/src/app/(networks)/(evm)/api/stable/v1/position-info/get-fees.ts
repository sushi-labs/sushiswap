import { publicClientConfig } from 'src/lib/wagmi/config/viem'
import { getPositionManager } from 'src/lib/wagmi/hooks/positions/position-manager'
import type { EvmAddress, SushiSwapV3ChainId } from 'sushi/evm'
import { createClient } from 'viem'
import { simulateContract } from 'viem/actions'

const MAX_UINT128 = 2n ** 128n - 1n

const abiShard = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'uint128',
            name: 'amount0Max',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'amount1Max',
            type: 'uint128',
          },
        ],
        internalType: 'struct INonfungiblePositionManager.CollectParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'collect',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

export const getFees = async ({
  tokenId,
  owner,
  chainId,
  positionManager = getPositionManager(chainId),
}: {
  tokenId: bigint
  owner: EvmAddress
  chainId: SushiSwapV3ChainId
  positionManager?: EvmAddress
}) => {
  const client = createClient(publicClientConfig[chainId])

  const { result } = await simulateContract(client, {
    abi: abiShard,
    address: positionManager,
    functionName: 'collect',
    args: [
      {
        tokenId,
        recipient: owner,
        amount0Max: MAX_UINT128,
        amount1Max: MAX_UINT128,
      },
    ],
    account: owner,
    value: 0n,
  })

  return { amount0: result[0], amount1: result[1] }
}
