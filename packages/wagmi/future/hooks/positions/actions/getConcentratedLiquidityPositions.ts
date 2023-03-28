import { ChainId } from '@sushiswap/chain'
import { getV3NFTPositionManagerContract } from '../../../../hooks/useNFTPositionManagerContract'
import { readContracts } from 'wagmi'
import { getConcentratedLiquidityPositionsFromTokenIds } from './getConcentratedLiquidityPositionsFromTokenIds'
import { getConcentratedLiquidityPositionFees } from './getConcentratedLiquidityPositionFees'
import { ConcentratedLiquidityPosition } from '../types'

export const getConcentratedLiquidityPositions = async ({
  account,
  chainIds,
}: {
  account: `0x${string}` | undefined
  chainIds: ChainId[]
}) => {
  if (!account) return undefined

  const result = await readContracts({
    contracts: chainIds.map((el) => ({
      ...getV3NFTPositionManagerContract(el),
      chainId: el,
      functionName: 'balanceOf',
      args: [account ?? undefined],
    })),
  })

  // we don't expect any account balance to ever exceed the bounds of max safe int
  const accountBalances = result.reduce<Record<ChainId, number>>((acc, el, i) => {
    if (el?.toNumber() > 0) {
      acc[chainIds[i]] = el?.toNumber()
    }
    return acc
  }, {} as Record<ChainId, number>)

  const tokenIdsArgs: [ChainId, `0x${string}`, number][] = []
  Object.entries(accountBalances).forEach(([k, v]) => {
    for (let i = 0; i < v; i++) {
      tokenIdsArgs.push([+k, account, i])
    }
  })

  const tokenIdResults = await readContracts({
    contracts: tokenIdsArgs.map(([_chainId, account, index]) => ({
      ...getV3NFTPositionManagerContract(_chainId),
      chainId: _chainId,
      functionName: 'tokenOfOwnerByIndex',
      args: [account, index],
    })),
  })

  const tokenIds = tokenIdResults.map((el, i) => ({
    chainId: tokenIdsArgs[i][0],
    tokenId: el,
  }))

  const positions = await getConcentratedLiquidityPositionsFromTokenIds({ tokenIds })
  const fees = await getConcentratedLiquidityPositionFees({ account, tokenIds })
  return positions.map((el, i) => ({
    ...el,
    fees: fees ? fees[i] : undefined,
  })) as ConcentratedLiquidityPosition[]
}
