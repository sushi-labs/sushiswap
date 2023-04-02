import { BigNumber } from 'ethers'
import { Address, readContracts } from 'wagmi'
import { getV3NFTPositionManagerContract } from '../../../../hooks/useNFTPositionManagerContract'
import { ChainId } from '@sushiswap/chain'
import { ConcentratedLiquidityPosition } from '../types'
import { getConcentratedLiquidityPositionFees } from './getConcentratedLiquidityPositionFees'
import { computePoolAddress } from '@sushiswap/v3-sdk'

export const getConcentratedLiquidityPositionsFromTokenIds = async ({
  tokenIds,
}: {
  tokenIds: { chainId: ChainId; tokenId: BigNumber }[]
}): Promise<ConcentratedLiquidityPosition[]> => {
  const results = await readContracts({
    contracts: tokenIds.map(
      (el) =>
        ({
          address: getV3NFTPositionManagerContract(el.chainId).address as Address,
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
          ] as const,
          chainId: el.chainId,
          functionName: 'positions',
          args: [el.tokenId],
        } as const)
    ),
  })

  const fees = await getConcentratedLiquidityPositionFees({ tokenIds })

  return results.map((call, i) => {
    const { tokenId, chainId } = tokenIds[i]
    const result = call
    return {
      id: tokenId.toNumber().toString(),
      address: computePoolAddress({
        // TODO Make dynamic
        factoryAddress: '0x1af415a1EbA07a4986a52B6f2e7dE7003D82231e',
        tokenA: result.token0,
        tokenB: result.token1,
        fee: result.fee,
      }),
      chainId,
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
