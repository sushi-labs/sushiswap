import { Address, PublicClient } from 'viem'
import {
  tridentGetPoolsAbi,
  tridentPoolsCountAbi,
  tridentSwapFeeAbi,
} from '../../abi/index.js'
import { ChainId } from '../../chain/index.js'
import {
  TRIDENT_CONSTANT_POOL_FACTORY_ADDRESS,
  TRIDENT_STABLE_POOL_FACTORY_ADDRESS,
  TridentChainId,
} from '../../config/index.js'
import { Currency, Token } from '../../currency/index.js'
import { DataFetcherOptions } from '../data-fetcher.js'
import { getCurrencyCombinations } from '../get-currency-combinations.js'

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
    t2: Token,
    options?: DataFetcherOptions,
  ): Promise<[TridentStaticPool[], TridentStaticPool[]]> {
    const pools = await Promise.all([
      this.getPools(client, chainId, t1, t2, 'CONSTANT_PRODUCT_POOL', options),
      this.getPools(client, chainId, t1, t2, 'STABLE_POOL', options),
    ])

    return pools
  }

  private static async getPools(
    client: PublicClient,
    chainId: ChainId,
    t1: Token,
    t2: Token,
    type: 'STABLE_POOL' | 'CONSTANT_PRODUCT_POOL',
    options?: DataFetcherOptions,
  ) {
    const currencies = getCurrencyCombinations(chainId, t1, t2)

    const _pairsUnique = pairsUnique(currencies)
    const _pairsUniqueAddr = _pairsUnique.map(([t0, t1]) => [
      t0.address,
      t1.address,
    ])
    const factoryAddress =
      type === 'STABLE_POOL'
        ? (TRIDENT_STABLE_POOL_FACTORY_ADDRESS[
            chainId as TridentChainId
          ] as Address)
        : (TRIDENT_CONSTANT_POOL_FACTORY_ADDRESS[
            chainId as TridentChainId
          ] as Address)

    const callStatePoolsCount = await client.multicall({
      multicallAddress: client.chain?.contracts?.multicall3?.address as Address,
      allowFailure: true,
      blockNumber: options?.blockNumber,
      contracts: _pairsUniqueAddr.map(
        (el) =>
          ({
            chainId,
            address: factoryAddress,
            abi: tridentPoolsCountAbi,
            functionName: 'poolsCount',
            args: el as [Address, Address],
          }) as const,
      ),
    })

    const callStatePoolsCountProcessed = callStatePoolsCount
      ?.map(
        (s, i) =>
          [i, s?.result ? parseInt(s.result.toString()) : 0] as [
            number,
            number,
          ],
      )
      .filter(([, length]) => length)
      .map(
        ([i, length]) =>
          [
            _pairsUniqueAddr[i]![0] as Address,
            _pairsUniqueAddr[i]![1] as Address,
            BigInt(0),
            BigInt(length),
          ] as const,
      )

    const pairsUniqueProcessed = callStatePoolsCount
      ?.map(
        (s, i) =>
          [i, s?.result ? parseInt(s.result.toString()) : 0] as [
            number,
            number,
          ],
      )
      .filter(([, length]) => length)
      .map(([i]) => [_pairsUnique[i]![0], _pairsUnique[i]![1]])

    const callStatePools = await client.multicall({
      multicallAddress: client.chain?.contracts?.multicall3?.address as Address,
      allowFailure: true,
      blockNumber: options?.blockNumber,
      contracts: callStatePoolsCountProcessed.map(
        (args) =>
          ({
            chainId,
            address: factoryAddress,
            abi: tridentGetPoolsAbi,
            functionName: 'getPools',
            args,
          }) as const,
      ),
    })

    const pools: TridentStaticPool[] = []
    callStatePools.forEach((s, i) => {
      if (s?.result)
        s.result.forEach((address) =>
          pools.push({
            address: address.toLowerCase() as Address,
            token0: pairsUniqueProcessed?.[i]![0] as Token,
            token1: pairsUniqueProcessed?.[i]![1] as Token,
            type,
          }),
        )
    })

    const poolsAddresses = pools.map((p) => p.address)

    const fees = await client.multicall({
      multicallAddress: client.chain?.contracts?.multicall3?.address as Address,
      allowFailure: true,
      blockNumber: options?.blockNumber,
      contracts: poolsAddresses.map(
        (address) =>
          ({
            chainId,
            address: address as Address,
            abi: tridentSwapFeeAbi,
            functionName: 'swapFee',
          }) as const,
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

const pairsUnique = (
  currencies: [Currency | undefined, Currency | undefined][],
) => {
  const pairsMap = new Map<string, [Token, Token]>()
  currencies.map(([c1, c2]) => {
    if (c1 && c2) {
      const addr1 = c1.wrapped.address as string | undefined
      const addr2 = c2.wrapped.address as string | undefined
      if (addr1 !== undefined && addr2 !== undefined) {
        if (addr1.toLowerCase() < addr2.toLowerCase())
          pairsMap.set(addr1 + addr2, [c1, c2] as [Token, Token])
        else pairsMap.set(addr2 + addr1, [c2, c1] as [Token, Token])
      }
    }
  })
  return Array.from(pairsMap.values())
}
