import { BigNumber } from 'ethers'
import { getV3NFTPositionManagerContract } from '../../../../hooks/useNFTPositionManagerContract'
import { ChainId } from '@sushiswap/chain'
import { getContract } from 'wagmi/actions'
import { getProvider } from '../../../../provider'

const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1)

export const getConcentratedLiquidityPositionFees = async ({
  account,
  tokenIds,
}: {
  account: `0x${string}` | undefined
  tokenIds: { chainId: ChainId; tokenId: BigNumber }[]
}) => {
  if (!account) return undefined

  const promises = tokenIds.map(async (el) => {
    const contract = getContract({
      address: getV3NFTPositionManagerContract(el.chainId).address,
      abi: [
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
      ],
      signerOrProvider: getProvider(el.chainId),
    })

    const result = await contract.callStatic.collect(
      {
        tokenId: el.tokenId,
        recipient: account,
        amount0Max: MAX_UINT128,
        amount1Max: MAX_UINT128,
      },
      { from: account }
    )

    if (result) {
      const typed = result as unknown as {
        amount0: BigNumber
        amount1: BigNumber
      }

      return [typed.amount0, typed.amount1]
    }

    return undefined
  })

  return Promise.all(promises)
}
