import { readContracts } from '@wagmi/core/actions'
import { SUSHISWAP_V3_POSITION_HELPER } from 'src/config'
import {
  SUSHISWAP_V3_FACTORY_ADDRESS,
  SUSHISWAP_V3_POSITION_MANAGER,
  type SushiSwapV3ChainId,
} from 'sushi/config'
import { computeSushiSwapV3PoolAddress } from 'sushi/pool'
import type { PublicWagmiConfig } from '../../../config/public'

const abiShard = [
  {
    inputs: [
      {
        internalType: 'contract INonfungiblePositionManager',
        name: 'positionManager',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'skip',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'first',
        type: 'uint256',
      },
    ],
    name: 'getUserPositions',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
          { internalType: 'uint96', name: 'nonce', type: 'uint96' },
          { internalType: 'address', name: 'operator', type: 'address' },
          { internalType: 'address', name: 'token0', type: 'address' },
          { internalType: 'address', name: 'token1', type: 'address' },
          { internalType: 'uint24', name: 'fee', type: 'uint24' },
          { internalType: 'int24', name: 'tickLower', type: 'int24' },
          { internalType: 'int24', name: 'tickUpper', type: 'int24' },
          { internalType: 'uint128', name: 'liquidity', type: 'uint128' },
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
          { internalType: 'uint128', name: 'tokensOwed0', type: 'uint128' },
          { internalType: 'uint128', name: 'tokensOwed1', type: 'uint128' },
        ],
        internalType: 'struct Position[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const BATCH_SIZE = 25
const MAX_ENTRIES = 100

export const getConcentratedLiquidityPositions = async ({
  account,
  chainIds,
  config,
}: {
  account: `0x${string}` | undefined
  chainIds: readonly SushiSwapV3ChainId[]
  config: PublicWagmiConfig
}) => {
  if (!account) return []

  const results = (
    await Promise.allSettled(
      chainIds.map(async (chainId) => {
        const pages = []
        let skip = 0
        let totalFetched = 0

        while (true) {
          const [res] = await readContracts(config, {
            contracts: [
              {
                address: SUSHISWAP_V3_POSITION_HELPER[chainId],
                abi: abiShard,
                chainId,
                functionName: 'getUserPositions',
                args: [
                  SUSHISWAP_V3_POSITION_MANAGER[chainId],
                  account,
                  BigInt(skip),
                  BigInt(BATCH_SIZE),
                ],
              } as const,
            ],
          })

          const batch = res?.result
          if (!batch?.length) break

          for (const position of batch) {
            pages.push({ chainId, position })
            totalFetched++
            if (totalFetched >= MAX_ENTRIES) break
          }

          if (batch.length < BATCH_SIZE || totalFetched >= MAX_ENTRIES) break
          skip += BATCH_SIZE
        }

        return pages
      }),
    )
  ).flatMap((r) => (r.status === 'fulfilled' ? r.value : []))

  return results.map(({ position, chainId }) => {
    return {
      id: position.tokenId.toString(),
      address: computeSushiSwapV3PoolAddress({
        factoryAddress: SUSHISWAP_V3_FACTORY_ADDRESS[chainId],
        tokenA: position.token0,
        tokenB: position.token1,
        fee: position.fee,
        chainId,
      }),
      chainId,
      tokenId: position.tokenId,
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
}
