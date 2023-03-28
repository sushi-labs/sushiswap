import { BigNumber } from 'ethers'
import { readContracts } from 'wagmi'
import { getV3NFTPositionManagerContract } from '../../../../hooks/useNFTPositionManagerContract'
import { ChainId } from '@sushiswap/chain'
import { ConcentratedLiquidityPosition } from '../types'

export const getConcentratedLiquidityPositionsFromTokenIds = async ({
  tokenIds,
}: {
  tokenIds: { chainId: ChainId; tokenId: BigNumber }[]
}): Promise<ConcentratedLiquidityPosition[]> => {
  const results = await readContracts({
    contracts: tokenIds.map((el) => ({
      ...getV3NFTPositionManagerContract(el.chainId),
      chainId: el.chainId,
      functionName: 'positions',
      args: [el.tokenId],
    })),
  })

  return results.map((call, i) => {
    const tokenId = tokenIds[i].tokenId
    const result = call
    return {
      id: tokenId?.toNumber().toString(),
      chainId: tokenIds[i].chainId,
      tokenId,
      fee: result.fee,
      feeGrowthInside0LastX128: result.feeGrowthInside0LastX128,
      feeGrowthInside1LastX128: result.feeGrowthInside1LastX128,
      liquidity: result.liquidity,
      nonce: result.nonce,
      operator: result.operator,
      tickLower: result.tickLower,
      tickUpper: result.tickUpper,
      token0: result.token0,
      token1: result.token1,
      tokensOwed0: result.tokensOwed0,
      tokensOwed1: result.tokensOwed1,
    }
  })
}
