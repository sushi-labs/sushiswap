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
      ...getV3NFTPositionManagerContract(el.chainId),
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
      return [result.amount0, result.amount1]
    }

    return undefined
  })

  return Promise.all(promises)
}
