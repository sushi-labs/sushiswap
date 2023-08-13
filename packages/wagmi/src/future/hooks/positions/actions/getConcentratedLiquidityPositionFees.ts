import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { getPublicClient } from 'wagmi/actions'

import { getV3NonFungiblePositionManagerConractConfig } from '../../contracts/useV3NonFungiblePositionManager'
import { getConcentratedPositionOwners } from '../../pools/actions/getConcentratedPositionOwner'

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
