import { BigNumber } from 'ethers'
import { getV3NFTPositionManagerContract } from '../../../../hooks/useNFTPositionManagerContract'
import { ChainId } from '@sushiswap/chain'
import { getContract } from 'wagmi/actions'
import { getProvider } from '../../../../provider'
import { getConcentratedPositionOwners } from '../../pools/actions/getConcentratedPositionOwner'

const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1)

export const getConcentratedLiquidityPositionFees = async ({
  tokenIds,
}: {
  tokenIds: { chainId: ChainId; tokenId: BigNumber }[]
}) => {
  const owners = await getConcentratedPositionOwners({ tokenIds })
  const promises = tokenIds.map(async (el, i) => {
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
        recipient: owners[i],
        amount0Max: MAX_UINT128,
        amount1Max: MAX_UINT128,
      },
      { from: owners[i] }
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
