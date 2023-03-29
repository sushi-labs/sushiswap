import { Token, Type } from '@sushiswap/currency'
import { computePoolAddress, FeeAmount, Pool } from '@sushiswap/v3-sdk'
import { JSBI } from '@sushiswap/math'
import { Address, readContracts } from 'wagmi'
import { ChainId } from '@sushiswap/chain'

// TODO MAKE DYNAMIC
const v3CoreFactoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984'

export enum ConcentratedLiquidityPoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export const getConcentratedLiquidityPools = async ({
  chainId,
  poolKeys,
}: {
  chainId: ChainId
  poolKeys: [Type | undefined, Type | undefined, FeeAmount | undefined][]
}): Promise<Pool[]> => {
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

  let poolAddresses: (string | undefined)[]
  if (!v3CoreFactoryAddress) {
    poolAddresses = new Array(poolTokens.length)
  } else {
    poolAddresses = poolTokens.map(
      (value) =>
        value &&
        computePoolAddress({
          factoryAddress: v3CoreFactoryAddress,
          tokenA: value[0],
          tokenB: value[1],
          fee: value[2],
        })
    )
  }

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
    if (!tokens) throw new Error('Invalid concentrated liquidity pool')
    const [token0, token1, fee] = tokens

    if (!slot0s[index]) throw new Error('Invalid concentrated liquidity pool')
    const slot0 = slot0s[index]

    if (!liquidities[index]) throw new Error('Invalid concentrated liquidity pool')
    const liquidity = liquidities[index]

    if (!tokens || !slot0 || !liquidity) throw new Error('Invalid concentrated liquidity pool')
    if (!slot0 || !liquidity) throw new Error('Concentrated liquidity pool doesnt exist')
    if (!slot0.sqrtPriceX96 || slot0.sqrtPriceX96.eq(0)) throw new Error('Concentrated liquidity pool doesnt exist')

    return new Pool(token0, token1, fee, JSBI.BigInt(slot0.sqrtPriceX96), JSBI.BigInt(liquidity), slot0.tick)
  })
}

export const getConcentratedLiquidityPool = async ({
  chainId,
  token0,
  token1,
  feeAmount,
}: {
  chainId: ChainId
  token0: Type | undefined
  token1: Type | undefined
  feeAmount: FeeAmount | undefined
}): Promise<Pool> => {
  const poolKeys: [Type | undefined, Type | undefined, FeeAmount | undefined][] = [[token0, token1, feeAmount]]
  return (await getConcentratedLiquidityPools({ poolKeys, chainId }))[0]
}
