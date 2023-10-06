import {
  tridentConstantPoolAbi,
  tridentConstantPoolFactoryAbi,
} from 'sushi/abi'
import { TridentConstantPool } from '@sushiswap/amm'
import { Amount, Currency, Token } from 'sushi/currency'
import { Address, readContracts } from 'wagmi'
import { getContract } from 'wagmi/actions'

import { getTridentConstantPoolFactoryContract } from '../../../contracts'
import { pairsUnique } from './utils'

export enum TridentConstantPoolState {
  LOADING = 'Loading',
  NOT_EXISTS = 'Not exists',
  EXISTS = 'Exists',
  INVALID = 'Invalid',
}

interface PoolData {
  address: string
  token0: Token
  token1: Token
}

export const getTridentConstantPools = async (
  chainId: number,
  currencies: [Currency | undefined, Currency | undefined][],
) => {
  // if (!isConstantProductPoolFactoryChainId(chainId)) {
  //   return []
  // }

  const contract = getContract(getTridentConstantPoolFactoryContract(chainId))

  const _pairsUnique = pairsUnique(currencies)
  const _pairsUniqueAddr = _pairsUnique.map(([t0, t1]) => [
    t0.address,
    t1.address,
  ])

  const callStatePoolsCount = await readContracts({
    contracts: _pairsUniqueAddr.map((el) => ({
      chainId,
      address: contract?.address as Address,
      abi: tridentConstantPoolFactoryAbi,
      functionName: 'poolsCount',
      args: el as [Address, Address],
    })),
  })

  const callStatePoolsCountProcessed =
    callStatePoolsCount
      ?.map(
        (s, i) =>
          [i, s.status === 'success' ? s.result : 0] as [number, bigint],
      )
      .filter(([, length]) => length)
      .map(
        ([i, length]) =>
          [
            _pairsUniqueAddr[i][0] as Address,
            _pairsUniqueAddr[i][1] as Address,
            0n,
            BigInt(length),
          ] as const,
      ) ?? []

  const pairsUniqueProcessed = callStatePoolsCount
    ?.map(
      (s, i) => [i, s.status === 'success' ? s.result : 0] as [number, bigint],
    )
    .filter(([, length]) => length)
    .map(([i]) => [_pairsUnique[i][0], _pairsUnique[i][1]])

  const callStatePools = await readContracts({
    contracts: (callStatePoolsCountProcessed || []).map((args) => ({
      chainId,
      address: contract?.address as Address,
      abi: tridentConstantPoolFactoryAbi,
      functionName: 'getPools',
      args,
    })),
  })

  const pools: PoolData[] = []
  callStatePools?.forEach((s, i) => {
    if (s.result !== undefined)
      s.result.forEach((address) => {
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
      abi: tridentConstantPoolAbi,
      functionName: 'getReserves' as const,
    })),
    ...poolsAddresses.map((address) => ({
      chainId,
      address,
      abi: tridentConstantPoolAbi,
      functionName: 'swapFee' as const,
    })),
  ]

  const reservesAndFees = await readContracts({
    contracts,
  })

  return pools.map((p, i) => {
    if (
      !reservesAndFees?.[i].result ||
      !reservesAndFees?.[i + poolsAddresses.length].result
    ) {
      return [TridentConstantPoolState.LOADING, null]
    }

    const [reserve0, reserve1, blockTimestampLast] = reservesAndFees[i]
      .result as [bigint, bigint, number]
    const swapFee = reservesAndFees[i + poolsAddresses.length].result as bigint

    return [
      TridentConstantPoolState.EXISTS,
      new TridentConstantPool(
        Amount.fromRawAmount(p.token0, reserve0),
        Amount.fromRawAmount(p.token1, reserve1),
        parseInt(swapFee.toString()),
        blockTimestampLast !== 0,
      ),
    ]
  })
}
