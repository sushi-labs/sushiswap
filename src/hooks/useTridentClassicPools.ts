import { Interface } from '@ethersproject/abi'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import ConstantProductPoolArtifact from '@sushiswap/trident/artifacts/contracts/pool/constant-product/ConstantProductPool.sol/ConstantProductPool.json'
import { computeConstantProductPoolAddress, ConstantProductPool, Fee } from '@sushiswap/trident-sdk'
import { PoolAtomType } from 'app/features/trident/types'
import { useConstantProductPoolFactory } from 'app/hooks/useContract'
import { useMultipleContractSingleData } from 'app/lib/hooks/multicall'
import { useActiveWeb3React } from 'app/services/web3'
import { useMemo } from 'react'

const CONSTANT_PRODUCT_POOL_INTERFACE = new Interface(ConstantProductPoolArtifact.abi)

export enum ConstantProductPoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function useTridentClassicPools(
  pools: [Currency | undefined, Currency | undefined, Fee | undefined, boolean | undefined][]
): PoolAtomType[] {
  const { chainId } = useActiveWeb3React()
  const constantProductPoolFactory = useConstantProductPoolFactory()

  const poolAddresses = useMemo(() => {
    if (!chainId) return []

    return pools.map(([currencyA, currencyB, fee, twap]) => {
      if (!currencyA || !currencyB || currencyA === currencyB) return undefined

      const [tokenA, tokenB] = currencyA?.wrapped.sortsBefore(currencyB?.wrapped)
        ? [currencyA?.wrapped, currencyB?.wrapped]
        : [currencyB?.wrapped, currencyA?.wrapped]

      return tokenA &&
        tokenB &&
        tokenA.chainId === tokenB.chainId &&
        !tokenA.equals(tokenB) &&
        fee &&
        twap !== undefined &&
        constantProductPoolFactory?.address
        ? computeConstantProductPoolAddress({
            factoryAddress: constantProductPoolFactory.address,
            tokenA,
            tokenB,
            fee,
            twap,
          })
        : undefined
    })
  }, [chainId, constantProductPoolFactory, pools])

  const results = useMultipleContractSingleData(poolAddresses, CONSTANT_PRODUCT_POOL_INTERFACE, 'getReserves')
  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = pools[i][0]?.wrapped
      const tokenB = pools[i][1]?.wrapped
      const fee = pools[i]?.[2]
      const twap = pools[i]?.[3]
      if (loading) return { state: ConstantProductPoolState.LOADING }
      if (!tokenA || !tokenB || tokenA.equals(tokenB) || !fee || twap === undefined)
        return { state: ConstantProductPoolState.INVALID }
      if (!reserves) return { state: ConstantProductPoolState.NOT_EXISTS }
      const [reserve0, reserve1] = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return {
        state: ConstantProductPoolState.EXISTS,
        pool: new ConstantProductPool(
          CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
          fee,
          twap
        ),
      }
    })
  }, [results, pools])
}

export function useTridentClassicPool(tokenA?: Currency, tokenB?: Currency, fee?: Fee, twap?: boolean): PoolAtomType {
  const inputs: [[Currency | undefined, Currency | undefined, Fee | undefined, boolean | undefined]] = useMemo(
    () => [[tokenA, tokenB, fee, twap]],
    [tokenA, tokenB, fee, twap]
  )
  return useTridentClassicPools(inputs)[0]
}
