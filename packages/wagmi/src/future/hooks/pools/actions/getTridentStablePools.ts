import { tridentStablePoolAbi, tridentStablePoolFactoryAbi } from '@sushiswap/abi'
import { TridentStablePool } from '@sushiswap/amm'
import { BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Amount, Currency, Token } from '@sushiswap/currency'
import { Address, readContracts } from 'wagmi'
import { getContract } from 'wagmi/actions'

import { getStablePoolFactoryContract } from '../../../contracts/actions'
import { pairsUnique } from './utils'

export enum TridentStablePoolState {
  LOADING = 'Loading',
  NOT_EXISTS = 'Not Exists',
  EXISTS = 'Exists',
  INVALID = 'Invalid',
}

interface PoolData {
  address: string
  token0: Token
  token1: Token
}

export const getTridentStablePools = async (
  chainId: BentoBoxV1ChainId,
  currencies: [Currency | undefined, Currency | undefined][],
  totals: Map<string, { base: bigint; elastic: bigint }>
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
      abi: tridentStablePoolFactoryAbi,
      functionName: 'poolsCount',
      args: el as [Address, Address],
    })),
  })

  const callStatePoolsCountProcessed = callStatePoolsCount
    ?.map((s, i) => [i, s ? parseInt(s.toString()) : 0] as [number, number])
    .filter(([, length]) => length)
    .map(
      ([i, length]) =>
        [_pairsUniqueAddr[i][0] as Address, _pairsUniqueAddr[i][1] as Address, 0n, BigInt(length)] as const
    )

  const pairsUniqueProcessed = callStatePoolsCount
    ?.map((s, i) => [i, s ? parseInt(s.toString()) : 0] as [number, number])
    .filter(([, length]) => length)
    .map(([i]) => [_pairsUnique[i][0], _pairsUnique[i][1]])

  const callStatePools = await readContracts({
    contracts: (callStatePoolsCountProcessed || []).map((args) => ({
      chainId,
      address: contract?.address as Address,
      abi: tridentStablePoolFactoryAbi,
      functionName: 'getPools' as const,
      args,
    })),
  })

  const pools: PoolData[] = []
  callStatePools?.forEach((s, i) => {
    if (s.result)
      s.result.forEach((address) =>
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
      abi: tridentStablePoolAbi,
      functionName: 'getReserves',
    })),
  })

  const fees = await readContracts({
    contracts: poolsAddresses.map((address) => ({
      chainId,
      address: address as Address,
      abi: tridentStablePoolAbi,
      functionName: 'swapFee',
    })),
  })

  return pools.map((p, i) => {
    const total0 = totals.get(p.token0.address)
    const total1 = totals.get(p.token1.address)

    const [reserve0, reserve1] = reserves?.[i]?.result || []
    if (!reserve0 || !reserve1 || !total0 || !total1) return [TridentStablePoolState.LOADING, null]
    return [
      TridentStablePoolState.EXISTS,
      new TridentStablePool(
        Amount.fromRawAmount(p.token0, reserve0),
        Amount.fromRawAmount(p.token1, reserve1),
        parseInt(fees[i].toString()),
        { base: total0.base, elastic: total0.elastic },
        { base: total1.base, elastic: total1.elastic }
      ),
    ]
  })
}
