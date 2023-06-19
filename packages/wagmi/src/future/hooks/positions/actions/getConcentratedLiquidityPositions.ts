import { ChainId } from '@sushiswap/chain'
import { readContracts } from 'wagmi'
import { getConcentratedLiquidityPositionsFromTokenIds } from './getConcentratedLiquidityPositionsFromTokenIds'
import { getConcentratedLiquidityPositionFees } from './getConcentratedLiquidityPositionFees'
import { ConcentratedLiquidityPosition } from '../types'
import { BigNumber } from 'ethers'
import { computePoolAddress, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { getV3NonFungiblePositionManagerConractConfig } from '../../contracts/useV3NonFungiblePositionManager'
import { getV3FactoryContractConfig } from '../../contracts/useV3FactoryContract'

export const getConcentratedLiquidityPositions = async ({
  account,
  chainIds,
}: {
  account: `0x${string}` | undefined
  chainIds: SushiSwapV3ChainId[]
}) => {
  if (!account) return undefined

  const result = await readContracts({
    contracts: chainIds.map(
      (el) =>
        ({
          address: getV3NonFungiblePositionManagerConractConfig(el).address,
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

  const tokenIdsArgs: [SushiSwapV3ChainId, `0x${string}`, number][] = []
  Object.entries(accountBalances).forEach(([k, v]) => {
    for (let i = 0; i < v; i++) {
      tokenIdsArgs.push([+k as SushiSwapV3ChainId, account, i])
    }
  })

  const tokenIdResults = await readContracts({
    contracts: tokenIdsArgs.map(
      ([_chainId, account, index]) =>
        ({
          chainId: _chainId,
          address: getV3NonFungiblePositionManagerConractConfig(_chainId).address,
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

  return positions.filter(Boolean).map((el, i) => ({
    ...el,
    address: computePoolAddress({
      factoryAddress: getV3FactoryContractConfig(el.chainId).address,
      tokenA: el.token0,
      tokenB: el.token1,
      fee: el.fee,
    }),
    fees: fees ? fees[i] : undefined,
  })) as ConcentratedLiquidityPosition[]
}
