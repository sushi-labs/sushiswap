import { constantProductPoolAbi, constantProductPoolFactoryAbi } from '@sushiswap/abi'
import { ConstantProductPool } from '@sushiswap/amm'
import { Amount, Currency, Token } from '@sushiswap/currency'
import { BigNumber } from 'ethers'
import { Address, readContracts } from 'wagmi'

import { getContract } from 'wagmi/actions'
import { getConstantProductPoolFactoryContract } from '@sushiswap/wagmi'

export enum ConstantProductPoolState {
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

export const getConstantProductPools = async (
  chainId: number | undefined,
  currencies: [Currency | undefined, Currency | undefined][]
) => {
  const contract = getContract({
    ...getConstantProductPoolFactoryContract(chainId),
  })

  const _pairsUnique = pairsUnique(currencies)
  const _pairsUniqueAddr = _pairsUnique.map(([t0, t1]) => [t0.address, t1.address])

  const callStatePoolsCount = await readContracts({
    contracts: _pairsUniqueAddr.map((el) => ({
      chainId,
      address: contract?.address as Address,
      abi: constantProductPoolFactoryAbi,
      functionName: 'poolsCount',
      args: el as [Address, Address],
    })),
  })

  const callStatePoolsCountProcessed =
    callStatePoolsCount
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
      ) ?? []

  const pairsUniqueProcessed = callStatePoolsCount
    ?.map((s, i) => [i, s ? parseInt(s.toString()) : 0] as [number, number])
    .filter(([, length]) => length)
    .map(([i]) => [_pairsUnique[i][0], _pairsUnique[i][1]])

  const callStatePools = await readContracts({
    contracts: (callStatePoolsCountProcessed || []).map((args) => ({
      chainId,
      address: contract?.address as Address,
      abi: constantProductPoolFactoryAbi,
      functionName: 'getPools',
      args,
    })),
  })

  const pools: PoolData[] = []
  callStatePools?.forEach((s, i) => {
    if (s !== undefined)
      s?.forEach((address) => {
        pools.push({
          address: address as Address,
          token0: pairsUniqueProcessed?.[i][0] as Token,
          token1: pairsUniqueProcessed?.[i][1] as Token,
        })
      })
  })

  const poolsAddresses = pools.map((p) => p.address as Address)

  const contracts = [
    ...poolsAddresses.map((address) => ({
      chainId,
      address,
      abi: constantProductPoolAbi,
      functionName: 'getReserves' as const,
    })),
    ...poolsAddresses.map((address) => ({
      chainId,
      address,
      abi: constantProductPoolAbi,
      functionName: 'swapFee' as const,
    })),
  ]

  const reservesAndFees = await readContracts({
    contracts,
  })

  return pools.map((p, i) => {
    if (!reservesAndFees?.[i] || !reservesAndFees?.[i + poolsAddresses.length]) {
      return [ConstantProductPoolState.LOADING, null]
    }

    const reserves = reservesAndFees[i] as {
      _reserve0: BigNumber
      _reserve1: BigNumber
      _blockTimestampLast: number
    }

    const swapFee = reservesAndFees[i + poolsAddresses.length]

    return [
      ConstantProductPoolState.EXISTS,
      new ConstantProductPool(
        Amount.fromRawAmount(p.token0, reserves._reserve0.toString()),
        Amount.fromRawAmount(p.token1, reserves._reserve1.toString()),
        parseInt(swapFee.toString()),
        reserves._blockTimestampLast !== 0
      ),
    ]
  })
}
