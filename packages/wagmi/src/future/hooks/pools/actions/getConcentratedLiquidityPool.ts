import { Token, Type } from '@sushiswap/currency'
import { computePoolAddress, FeeAmount, Pool, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { JSBI } from '@sushiswap/math'
import { Address, readContracts } from 'wagmi'
import { getV3FactoryContractConfig } from '../../contracts/useV3FactoryContract'

export const getConcentratedLiquidityPools = async ({
  chainId,
  poolKeys,
}: {
  chainId: SushiSwapV3ChainId
  poolKeys: [Type | undefined, Type | undefined, FeeAmount | undefined][]
}): Promise<(Pool | null)[]> => {
  let poolTokens: ([Token, Token, FeeAmount] | undefined)[]
  if (!chainId) {
    poolTokens = new Array(poolKeys.length)
  } else {
    poolTokens = poolKeys.map(([currencyA, currencyB, feeAmount]) => {
      if (currencyA && currencyB && feeAmount) {
        const tokenA = currencyA.wrapped
        const tokenB = currencyB.wrapped
        if (tokenA.equals(tokenB)) return undefined

        return tokenA.sortsBefore(tokenB) ? [tokenA, tokenB, feeAmount] : [tokenB, tokenA, feeAmount]
      }
      return undefined
    })
  }

  const poolAddresses = poolTokens.map(
    (value) =>
      value &&
      computePoolAddress({
        factoryAddress: getV3FactoryContractConfig(chainId).address,
        tokenA: value[0],
        tokenB: value[1],
        fee: value[2],
      })
  )

  const slot0s = await readContracts({
    contracts: poolAddresses.map(
      (el) =>
        ({
          chainId,
          address: el as Address,
          abi: [
            {
              inputs: [],
              name: 'slot0',
              outputs: [
                { internalType: 'uint160', name: 'sqrtPriceX96', type: 'uint160' },
                { internalType: 'int24', name: 'tick', type: 'int24' },
                { internalType: 'uint16', name: 'observationIndex', type: 'uint16' },
                { internalType: 'uint16', name: 'observationCardinality', type: 'uint16' },
                { internalType: 'uint16', name: 'observationCardinalityNext', type: 'uint16' },
                { internalType: 'uint8', name: 'feeProtocol', type: 'uint8' },
                { internalType: 'bool', name: 'unlocked', type: 'bool' },
              ],
              stateMutability: 'view',
              type: 'function',
            },
          ],
          functionName: 'slot0',
        } as const)
    ),
  })

  const liquidities = await readContracts({
    contracts: poolAddresses.map(
      (el) =>
        ({
          chainId,
          address: el as Address,
          abi: [
            {
              inputs: [],
              name: 'liquidity',
              outputs: [{ internalType: 'uint128', name: '', type: 'uint128' }],
              stateMutability: 'view',
              type: 'function',
            },
          ],
          functionName: 'liquidity',
        } as const)
    ),
  })

  return poolKeys.map((_key, index) => {
    const tokens = poolTokens[index]
    if (!tokens) return null
    const [token0, token1, fee] = tokens

    if (!slot0s[index]) return null
    const slot0 = slot0s[index]

    if (!liquidities[index]) return null
    const liquidity = liquidities[index]

    if (!tokens || !slot0 || !liquidity) return null
    if (!slot0 || !liquidity) return null
    if (!slot0.sqrtPriceX96 || slot0.sqrtPriceX96.eq(0)) return null

    return new Pool(token0, token1, fee, JSBI.BigInt(slot0.sqrtPriceX96), JSBI.BigInt(liquidity), slot0.tick)
  })
}

export const getConcentratedLiquidityPool = async ({
  chainId,
  token0,
  token1,
  feeAmount,
}: {
  chainId: SushiSwapV3ChainId
  token0: Type | undefined
  token1: Type | undefined
  feeAmount: FeeAmount | undefined
}): Promise<Pool | null> => {
  const poolKeys: [Type | undefined, Type | undefined, FeeAmount | undefined][] = [[token0, token1, feeAmount]]
  return (await getConcentratedLiquidityPools({ poolKeys, chainId }))[0]
}
