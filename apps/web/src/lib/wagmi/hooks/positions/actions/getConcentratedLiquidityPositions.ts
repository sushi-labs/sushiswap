import { readContracts } from '@wagmi/core/actions'
import type { ChainId } from 'sushi/chain'
import {
  SUSHISWAP_V3_FACTORY_ADDRESS,
  SUSHISWAP_V3_INIT_CODE_HASH,
  SUSHISWAP_V3_POSITION_MANAGER,
  type SushiSwapV3ChainId,
} from 'sushi/config'
import { computeSushiSwapV3PoolAddress } from 'sushi/pool/sushiswap-v3'
import { erc20Abi } from 'viem'
import type { PublicWagmiConfig } from '../../../config/public'
import type { ConcentratedLiquidityPosition } from '../types'
import { getConcentratedLiquidityPositionFees } from './getConcentratedLiquidityPositionFees'
import { getConcentratedLiquidityPositionsFromTokenIds } from './getConcentratedLiquidityPositionsFromTokenIds'

const abiShard = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const getConcentratedLiquidityPositions = async ({
  account,
  chainIds,
  config,
}: {
  account: `0x${string}` | undefined
  chainIds: SushiSwapV3ChainId[]
  config: PublicWagmiConfig
}) => {
  if (!account) return undefined

  const result = await readContracts(config, {
    contracts: chainIds.map(
      (el) =>
        ({
          address: SUSHISWAP_V3_POSITION_MANAGER[el],
          abi: erc20Abi,
          chainId: el,
          functionName: 'balanceOf' as const,
          args: [account],
        }) as const,
    ),
  })

  // we don't expect any account balance to ever exceed the bounds of max safe int
  const accountBalances = result.reduce<Record<ChainId, number>>(
    (acc, el, i) => {
      if (el.result && el.result > 0n) {
        acc[chainIds[i]] = Number(el.result)
      }
      return acc
    },
    {} as Record<ChainId, number>,
  )

  const tokenIdsArgs: [SushiSwapV3ChainId, `0x${string}`, number][] = []
  Object.entries(accountBalances).forEach(([k, v]) => {
    for (let i = 0; i < v; i++) {
      tokenIdsArgs.push([+k as SushiSwapV3ChainId, account, i])
    }
  })

  const tokenIdResults = await readContracts(config, {
    contracts: tokenIdsArgs.map(
      ([_chainId, account, index]) =>
        ({
          chainId: _chainId,
          address: SUSHISWAP_V3_POSITION_MANAGER[_chainId],
          abi: abiShard,
          functionName: 'tokenOfOwnerByIndex' as const,
          args: [account, BigInt(index)],
        }) as const,
    ),
  })

  const tokenIds = tokenIdResults
    .map((el, i) => {
      if (!el.result) return undefined

      return {
        chainId: tokenIdsArgs[i][0],
        tokenId: el.result,
      }
    })
    .filter((el): el is NonNullable<typeof el> => el !== undefined)

  const positions = await getConcentratedLiquidityPositionsFromTokenIds({
    tokenIds,
    config,
  })
  const fees = await getConcentratedLiquidityPositionFees({ tokenIds, config })

  return positions.filter(Boolean).map((el, i) => ({
    ...el,
    address: computeSushiSwapV3PoolAddress({
      factoryAddress: SUSHISWAP_V3_FACTORY_ADDRESS[el.chainId],
      tokenA: el.token0,
      tokenB: el.token1,
      fee: el.fee,
      initCodeHashManualOverride:
        SUSHISWAP_V3_INIT_CODE_HASH[el.chainId as SushiSwapV3ChainId],
      chainId: el.chainId,
    }),
    fees: fees ? fees[i] : undefined,
  })) as ConcentratedLiquidityPosition[]
}
