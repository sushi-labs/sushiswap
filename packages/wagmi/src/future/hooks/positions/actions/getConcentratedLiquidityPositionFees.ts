import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { getPublicClient } from 'wagmi/actions'

import { getV3NonFungiblePositionManagerConractConfig } from '../../contracts/useV3NonFungiblePositionManager'
import { getConcentratedPositionOwners } from '../../pools/actions/getConcentratedPositionOwner'

const MAX_UINT128 = 2n ** 128n - 1n

declare const abiShard: [
  {
    readonly inputs: readonly [
      {
        readonly components: readonly [
          {
            readonly internalType: 'uint256'
            readonly name: 'tokenId'
            readonly type: 'uint256'
          },
          {
            readonly internalType: 'address'
            readonly name: 'recipient'
            readonly type: 'address'
          },
          {
            readonly internalType: 'uint128'
            readonly name: 'amount0Max'
            readonly type: 'uint128'
          },
          {
            readonly internalType: 'uint128'
            readonly name: 'amount1Max'
            readonly type: 'uint128'
          }
        ]
        readonly internalType: 'struct INonfungiblePositionManager.CollectParams'
        readonly name: 'params'
        readonly type: 'tuple'
      }
    ]
    readonly name: 'collect'
    readonly outputs: [
      {
        readonly internalType: 'uint256'
        readonly name: 'amount0'
        readonly type: 'uint256'
      },
      {
        readonly internalType: 'uint256'
        readonly name: 'amount1'
        readonly type: 'uint256'
      }
    ]
    readonly stateMutability: 'payable'
    readonly type: 'function'
  }
]

export const getConcentratedLiquidityPositionFees = async ({
  tokenIds,
}: {
  tokenIds: { chainId: SushiSwapV3ChainId; tokenId: bigint }[]
}) => {
  const owners = await getConcentratedPositionOwners({ tokenIds })
  const promises = tokenIds.map(async (el, i) => {
    const owner = owners[i].result
    if (!owner) return undefined

    const result = await getPublicClient({ chainId: el.chainId }).simulateContract({
      abi: abiShard,
      address: getV3NonFungiblePositionManagerConractConfig(el.chainId).address,
      functionName: 'collect',
      args: [{ tokenId: el.tokenId, recipient: owner, amount0Max: MAX_UINT128, amount1Max: MAX_UINT128 }],
      account: owner,
      value: 0n,
    })

    return result.result
  })

  return Promise.all(promises)
}
