import { tridentConstantPoolAbi, tridentStablePoolAbi } from '@sushiswap/abi'
import { ChainId } from '@sushiswap/chain'
import { Currency, Token } from '@sushiswap/currency'
import {
  tridentConstantPoolFactoryAbi,
  tridentConstantPoolFactoryAddress,
  TridentConstantPoolFactoryChainId,
  tridentStablePoolFactoryAbi,
  tridentStablePoolFactoryAddress,
  TridentStablePoolFactoryChainId,
} from '@sushiswap/trident-sdk'
import { Address, PublicClient } from 'viem'

import { getCurrencyCombinations } from '../getCurrencyCombinations'

export interface TridentStaticPool {
  address: Address
  token0: Token
  token1: Token
  type: 'STABLE_POOL' | 'CONSTANT_PRODUCT_POOL'
  swapFee?: number
}

export class TridentStaticPoolFetcher {
  static async getStaticPools(
    client: PublicClient,
    chainId: ChainId,
    t1: Token,
    t2: Token
  ): Promise<[TridentStaticPool[], TridentStaticPool[]]> {
    const pools = await Promise.all([
      this.getPools(client, chainId, t1, t2, 'CONSTANT_PRODUCT_POOL'),
      this.getPools(client, chainId, t1, t2, 'STABLE_POOL'),
    ])

    return pools
  }

  private static async getPools(
    client: PublicClient,
    chainId: ChainId,
    t1: Token,
    t2: Token,
    type: 'STABLE_POOL' | 'CONSTANT_PRODUCT_POOL'
  ) {
    const currencies = getCurrencyCombinations(chainId, t1, t2)

    const _pairsUnique = pairsUnique(currencies)
    const _pairsUniqueAddr = _pairsUnique.map(([t0, t1]) => [t0.address, t1.address])
    const factoryAddress =
      type === 'STABLE_POOL'
        ? (tridentStablePoolFactoryAddress[chainId as TridentStablePoolFactoryChainId] as Address)
        : (tridentConstantPoolFactoryAddress[chainId as TridentConstantPoolFactoryChainId] as Address)
    const factoryAbi =
      type === 'STABLE_POOL'
        ? tridentStablePoolFactoryAbi[chainId as TridentStablePoolFactoryChainId]
        : tridentConstantPoolFactoryAbi[chainId as TridentConstantPoolFactoryChainId]

    const callStatePoolsCount = await client.multicall({
      multicallAddress: client.chain?.contracts?.multicall3?.address as Address,
      allowFailure: true,
      contracts: _pairsUniqueAddr.map(
        (el) =>
          ({
            chainId,
            address: factoryAddress,
            abi: factoryAbi,
            functionName: 'poolsCount',
            args: el as [Address, Address],
          } as const)
      ),
    })

    const callStatePoolsCountProcessed = callStatePoolsCount
      ?.map((s, i) => [i, s?.result ? parseInt(s.result.toString()) : 0] as [number, number])
      .filter(([, length]) => length)
      .map(
        ([i, length]) =>
          [_pairsUniqueAddr[i][0] as Address, _pairsUniqueAddr[i][1] as Address, BigInt(0), BigInt(length)] as const
      )

    const pairsUniqueProcessed = callStatePoolsCount
      ?.map((s, i) => [i, s?.result ? parseInt(s.result.toString()) : 0] as [number, number])
      .filter(([, length]) => length)
      .map(([i]) => [_pairsUnique[i][0], _pairsUnique[i][1]])

    const callStatePools = await client.multicall({
      multicallAddress: client.chain?.contracts?.multicall3?.address as Address,
      allowFailure: true,
      contracts: callStatePoolsCountProcessed.map(
        (args) =>
          ({
            chainId,
            address: factoryAddress,
            abi: factoryAbi,
            functionName: 'getPools',
            args,
          } as const)
      ),
    })

    const pools: TridentStaticPool[] = []
    callStatePools.forEach((s, i) => {
      if (s?.result)
        s.result.forEach((address) =>
          pools.push({
            address: address.toLowerCase() as Address,
            token0: pairsUniqueProcessed?.[i][0] as Token,
            token1: pairsUniqueProcessed?.[i][1] as Token,
            type,
          })
        )
    })

    const poolsAddresses = pools.map((p) => p.address)

    const fees = await client.multicall({
      multicallAddress: client.chain?.contracts?.multicall3?.address as Address,
      allowFailure: true,
      contracts: poolsAddresses.map(
        (address) =>
          ({
            chainId,
            address: address as Address,
            abi: type === 'STABLE_POOL' ? tridentStablePoolAbi : tridentConstantPoolAbi,
            functionName: 'swapFee',
          } as const)
      ),
    })
    const results: TridentStaticPool[] = []

    pools.forEach((p, i) => {
      const fee = fees?.[i]?.result

      if (!fee) return
      results.push({
        ...p,
        swapFee: Number(fee) / 10_000,
      })
    })
    return results
  }
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

const tokensUnique = (_pairsUnique: [Token, Token][]) =>
  Array.from(
    new Set(_pairsUnique.reduce<Token[]>((previousValue, currentValue) => previousValue.concat(currentValue), []))
  )
