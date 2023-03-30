import { BigNumber } from 'ethers'
import { readContracts } from 'wagmi'
import { getV3NFTPositionManagerContract } from '../../../../hooks/useNFTPositionManagerContract'
import { ChainId } from '@sushiswap/chain'
import { ConcentratedLiquidityPosition } from '../types'
import { getConcentratedLiquidityPositionFees } from './getConcentratedLiquidityPositionFees'

export const getConcentratedLiquidityPositionsFromTokenIds = async ({
  tokenIds,
}: {
  tokenIds: { chainId: ChainId; tokenId: BigNumber }[]
}): Promise<ConcentratedLiquidityPosition[]> => {
  const results = await readContracts({
    contracts: tokenIds.map(
      (el) =>
        ({
          address: getV3NFTPositionManagerContract(el.chainId).address,
          abi: [
            {
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'tokenId',
                  type: 'uint256',
                },
              ],
              name: 'positions',
              outputs: [
                {
                  internalType: 'uint96',
                  name: 'nonce',
                  type: 'uint96',
                },
                {
                  internalType: 'address',
                  name: 'operator',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'token0',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'token1',
                  type: 'address',
                },
                {
                  internalType: 'uint24',
                  name: 'fee',
                  type: 'uint24',
                },
                {
                  internalType: 'int24',
                  name: 'tickLower',
                  type: 'int24',
                },
                {
                  internalType: 'int24',
                  name: 'tickUpper',
                  type: 'int24',
                },
                {
                  internalType: 'uint128',
                  name: 'liquidity',
                  type: 'uint128',
                },
                {
                  internalType: 'uint256',
                  name: 'feeGrowthInside0LastX128',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'feeGrowthInside1LastX128',
                  type: 'uint256',
                },
                {
                  internalType: 'uint128',
                  name: 'tokensOwed0',
                  type: 'uint128',
                },
                {
                  internalType: 'uint128',
                  name: 'tokensOwed1',
                  type: 'uint128',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
          ],
          chainId: el.chainId,
          functionName: 'positions',
          args: [el.tokenId],
        } as const)
    ),
  })

  const fees = await getConcentratedLiquidityPositionFees({ tokenIds })

  return results.map((call, i) => {
    const tokenId = tokenIds[i].tokenId
    const result = call
    return {
      id: tokenId?.toNumber().toString(),
      chainId: tokenIds[i].chainId,
      tokenId,
      fee: result.fee,
      fees: fees[i],
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
