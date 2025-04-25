import { readContracts } from '@wagmi/core/actions'
import {
  SUSHISWAP_V3_FACTORY_ADDRESS,
  SUSHISWAP_V3_POSITION_HELPER,
  SUSHISWAP_V3_POSITION_MANAGER,
  type SushiSwapV3ChainId,
} from 'sushi/config'
import { computeSushiSwapV3PoolAddress } from 'sushi/pool/sushiswap-v3'
import type { PublicWagmiConfig } from '../../../config/public'
import type { ConcentratedLiquidityPosition } from '../types'

const abiShard = [
  {
    name: 'getPosition',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'positionManager', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [
      {
        components: [
          { name: 'tokenId', type: 'uint256' },
          { name: 'nonce', type: 'uint96' },
          { name: 'operator', type: 'address' },
          { name: 'token0', type: 'address' },
          { name: 'token1', type: 'address' },
          { name: 'fee', type: 'uint24' },
          { name: 'tickLower', type: 'int24' },
          { name: 'tickUpper', type: 'int24' },
          { name: 'liquidity', type: 'uint128' },
          { name: 'feeGrowthInside0LastX128', type: 'uint256' },
          { name: 'feeGrowthInside1LastX128', type: 'uint256' },
          { name: 'tokensOwed0', type: 'uint128' },
          { name: 'tokensOwed1', type: 'uint128' },
        ],
        type: 'tuple',
      },
    ],
  },
] as const

export const getConcentratedLiquidityPositionsFromTokenIds = async ({
  tokenIds,
  config,
}: {
  tokenIds: { chainId: SushiSwapV3ChainId; tokenId: bigint }[]
  config: PublicWagmiConfig
}): Promise<ConcentratedLiquidityPosition[]> => {
  const results = await readContracts(config, {
    contracts: tokenIds.map(({ chainId, tokenId }) => ({
      address: SUSHISWAP_V3_POSITION_HELPER[chainId],
      abi: abiShard,
      chainId,
      functionName: 'getPosition',
      args: [SUSHISWAP_V3_POSITION_MANAGER[chainId], tokenId],
    })),
  })

  return results
    .map((result, i) => {
      if (result.status !== 'success' || !result.result) return undefined

      const position = result.result
      const { tokenId, chainId } = tokenIds[i]

      return {
        id: tokenId.toString(),
        address: computeSushiSwapV3PoolAddress({
          factoryAddress: SUSHISWAP_V3_FACTORY_ADDRESS[chainId],
          tokenA: position.token0,
          tokenB: position.token1,
          fee: position.fee,
          chainId,
        }),
        chainId,
        tokenId,
        fee: position.fee,
        fees: [position.tokensOwed0, position.tokensOwed1],
        feeGrowthInside0LastX128: position.feeGrowthInside0LastX128,
        feeGrowthInside1LastX128: position.feeGrowthInside1LastX128,
        liquidity: position.liquidity,
        nonce: position.nonce,
        operator: position.operator,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        token0: position.token0,
        token1: position.token1,
        tokensOwed0: position.tokensOwed0,
        tokensOwed1: position.tokensOwed1,
      }
    })
    .filter((el): el is NonNullable<typeof el> => el !== undefined)
}
