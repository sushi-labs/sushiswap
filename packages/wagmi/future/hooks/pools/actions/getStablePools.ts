import { Amount, Currency, Token } from '@sushiswap/currency'
import { StablePool } from '@sushiswap/amm'
import { Address, readContracts } from 'wagmi'
import { BigNumber } from 'ethers'
import { getContract } from 'wagmi/actions'
import { JSBI } from '@sushiswap/math'
import { BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { stablePoolAbi, stablePoolFactoryAbi } from '@sushiswap/abi'
import { getStablePoolFactoryContract } from '../../../contracts/actions'
import { pairsUnique, tokensUnique } from './utils'

export enum StablePoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

interface PoolData {
  address: string
  token0: Token
  token1: Token
}

export const getStablePools = async (
  chainId: BentoBoxV1ChainId,
  currencies: [Currency | undefined, Currency | undefined][],
  totals: Map<string, { base: BigNumber; elastic: BigNumber }>
) => {
  const contract = getContract({
    ...getStablePoolFactoryContract(chainId),
  })

  const _pairsUnique = pairsUnique(currencies)
  const _pairsUniqueAddr = _pairsUnique.map(([t0, t1]) => [t0.address, t1.address])
  // const _tokensUnique = tokensUnique(_pairsUnique)

  const callStatePoolsCount = await readContracts({
    contracts: _pairsUniqueAddr.map((el) => ({
      chainId,
      address: contract?.address as Address,
      abi: stablePoolFactoryAbi,
      functionName: 'poolsCount',
      args: el as [Address, Address],
    })),
  })

  const callStatePoolsCountProcessed = callStatePoolsCount
    ?.map((s, i) => [i, s ? parseInt(s.toString()) : 0] as [number, number])
    .filter(([, length]) => length)
    .map(
      ([i, length]) =>
        [
          _pairsUniqueAddr[i][0] as Address,
          _pairsUniqueAddr[i][1] as Address,
          BigNumber.from(0),
          BigNumber.from(length),
        ] as const
    )

  const pairsUniqueProcessed = callStatePoolsCount
    ?.map((s, i) => [i, s ? parseInt(s.toString()) : 0] as [number, number])
    .filter(([, length]) => length)
    .map(([i]) => [_pairsUnique[i][0], _pairsUnique[i][1]])

  const callStatePools = await readContracts({
    contracts: (callStatePoolsCountProcessed || []).map((args) => ({
      chainId,
      address: contract?.address as Address,
      abi: stablePoolFactoryAbi,
      functionName: 'getPools',
      args,
    })),
  })

  const pools: PoolData[] = []
  callStatePools?.forEach((s, i) => {
    if (s)
      s.forEach((address) =>
        pools.push({
          address,
          token0: pairsUniqueProcessed?.[i][0] as Token,
          token1: pairsUniqueProcessed?.[i][1] as Token,
        })
      )
  })

  const poolsAddresses = pools.map((p) => p.address)

  const reserves = await readContracts({
    contracts: poolsAddresses.map((address) => ({
      chainId,
      address: address as Address,
      abi: stablePoolAbi,
      functionName: 'getReserves',
    })),
  })

  const fees = await readContracts({
    contracts: poolsAddresses.map((address) => ({
      chainId,
      address: address as Address,
      abi: stablePoolAbi,
      functionName: 'swapFee',
    })),
  })

  return pools.map((p, i) => {
    const total0 = totals.get(p.token0.address)
    const total1 = totals.get(p.token1.address)
    if (!reserves?.[i] || !fees?.[i] || !total0 || !total1) return [StablePoolState.LOADING, null]
    return [
      StablePoolState.EXISTS,
      new StablePool(
        Amount.fromRawAmount(p.token0, reserves[i]._reserve0.toString()),
        Amount.fromRawAmount(p.token1, reserves[i]._reserve1.toString()),
        parseInt(fees[i].toString()),
        { base: JSBI.BigInt(total0.base), elastic: JSBI.BigInt(total0.elastic) },
        { base: JSBI.BigInt(total1.base), elastic: JSBI.BigInt(total1.elastic) }
      ),
    ]
  })
}
