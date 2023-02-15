import { Amount, Currency, Token } from '@sushiswap/currency'
import { StablePool } from '@sushiswap/amm'
import { getStablePoolFactoryContract, StablePoolState, useBentoBoxTotals } from '@sushiswap/wagmi'
import { Address, readContracts } from 'wagmi'
import { stablePoolAbi, stablePoolFactoryAbi } from '@sushiswap/wagmi/abis'
import { BigNumber } from 'ethers'
import { getContract } from 'wagmi/actions'
import { getBentoboxTotals } from './getBentoboxTotals'

interface PoolData {
  address: string
  token0: Token
  token1: Token
}

const pairsUnique = (currencies: [Currency | undefined, Currency | undefined][]) => {
  const pairsMap = new Map<string, [Token, Token]>()
  currencies.map(([c1, c2]) => {
    if (c1 && c2) {
      const addr1 = c1.wrapped.address as string | undefined
      const addr2 = c2.wrapped.address as string | undefined
      if (addr1 !== undefined && addr2 !== undefined) {
        if (addr1.toLowerCase() < addr2.toLowerCase()) pairsMap.set(addr1 + addr2, [c1, c2] as [Token, Token])
        else pairsMap.set(addr2 + addr1, [c2, c1] as [Token, Token])
      }
    }
  })
  return Array.from(pairsMap.values())
}

export const getStablePools = async (
  chainId: number | undefined,
  currencies: [Currency | undefined, Currency | undefined][]
) => {
  const contract = getContract({
    ...getStablePoolFactoryContract(chainId),
  })

  const _pairsUnique = pairsUnique(currencies)
  const _pairsUniqueAddr = _pairsUnique.map(([t0, t1]) => [t0.address, t1.address])
  const tokensUnique = Array.from(
    new Set(_pairsUnique.reduce<Token[]>((previousValue, currentValue) => previousValue.concat(currentValue), []))
  )

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
      address,
      abi: stablePoolAbi,
      functionName: 'getReserves',
    })),
  })

  const fees = await readContracts({
    contracts: poolsAddresses.map((address) => ({
      chainId,
      address,
      abi: stablePoolAbi,
      functionName: 'swapFee',
    })),
  })

  const totals = await getBentoboxTotals(chainId, tokensUnique)

  return pools.map((p, i) => {
    if (
      !reserves?.[i] ||
      !fees?.[i] ||
      !totals ||
      !(p.token0.wrapped.address in totals) ||
      !(p.token1.wrapped.address in totals)
    )
      return [StablePoolState.LOADING, null]
    return [
      StablePoolState.EXISTS,
      new StablePool(
        Amount.fromRawAmount(p.token0, reserves[i]._reserve0.toString()),
        Amount.fromRawAmount(p.token1, reserves[i]._reserve1.toString()),
        parseInt(fees[i].toString()),
        totals[p.token0.wrapped.address],
        totals[p.token1.wrapped.address]
      ),
    ]
  })
}
