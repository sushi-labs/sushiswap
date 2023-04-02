import { ChainId } from '@sushiswap/chain'
import { getV3NFTPositionManagerContract } from '../../../../hooks/useNFTPositionManagerContract'
import { readContracts } from 'wagmi'
import { getConcentratedLiquidityPositionsFromTokenIds } from './getConcentratedLiquidityPositionsFromTokenIds'
import { getConcentratedLiquidityPositionFees } from './getConcentratedLiquidityPositionFees'
import { ConcentratedLiquidityPosition } from '../types'
import { BigNumber } from 'ethers'
import { computePoolAddress } from '@sushiswap/v3-sdk'

export const getConcentratedLiquidityPositions = async ({
  account,
  chainIds,
}: {
  account: `0x${string}` | undefined
  chainIds: ChainId[]
}) => {
  if (!account) return undefined

  const result = await readContracts({
    contracts: chainIds.map(
      (el) =>
        ({
          address: getV3NFTPositionManagerContract(el).address,
          abi: [
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
              ],
              name: 'balanceOf',
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
          ],
          chainId: el,
          functionName: 'balanceOf',
          args: [account ?? undefined],
        } as const)
    ),
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
    contracts: tokenIdsArgs.map(
      ([_chainId, account, index]) =>
        ({
          chainId: _chainId,
          address: getV3NFTPositionManagerContract(_chainId).address,
          abi: [
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
          ],
          functionName: 'tokenOfOwnerByIndex',
          args: [account, BigNumber.from(index)],
        } as const)
    ),
  })

  const tokenIds = tokenIdResults.map((el, i) => ({
    chainId: tokenIdsArgs[i][0],
    tokenId: el,
  }))

  const positions = await getConcentratedLiquidityPositionsFromTokenIds({ tokenIds })
  const fees = await getConcentratedLiquidityPositionFees({ tokenIds })

  return positions.map((el, i) => ({
    ...el,
    address: computePoolAddress({
      // TODO Make dynamic
      factoryAddress: '0x1af415a1EbA07a4986a52B6f2e7dE7003D82231e',
      tokenA: el.token0,
      tokenB: el.token1,
      fee: el.fee,
    }),
    fees: fees ? fees[i] : undefined,
  })) as ConcentratedLiquidityPosition[]
}
