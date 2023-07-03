import { getReservesAbi } from '@sushiswap/abi'
import { computePairAddress } from '@sushiswap/amm'
import { Token } from '@sushiswap/currency'
import { ConstantProductPoolCode, LiquidityProviders } from '@sushiswap/router'
import { ConstantProductRPool, RToken } from '@sushiswap/tines'
import { BigNumber } from 'ethers'
import { Address, decodeEventLog, Log, parseAbiItem, PublicClient } from 'viem'

import { Counter } from './Counter'
import { LogFilter } from './LogFilter'
import { MultiCallAggregator } from './MulticallAggregator'
import { warnLog } from './WarnLog'

export interface FactoryV2 {
  address: Address
  provider: LiquidityProviders
  fee: number
  initCodeHash: string
}

interface PoolState {
  poolCode: ConstantProductPoolCode
  isUpdated: boolean
}

const UniV2EventsAbi = [parseAbiItem('event Sync(uint112 reserve0, uint112 reserve1)')]
const UniV2FactoryAbi = [
  parseAbiItem('function allPairsLength() external view returns (uint)'),
  parseAbiItem('function allPairs(uint256) external view returns (address)'),
]

export class UniV2Extractor {
  factories: FactoryV2[]
  client: PublicClient
  multiCallAggregator: MultiCallAggregator
  poolMap: Map<Address, PoolState> = new Map()
  unexistedPools: Set<Address> = new Set()
  addressCache: Map<string, Address> = new Map()
  logFilter: LogFilter
  logging: boolean
  busyCounter: Counter

  /// @param client
  /// @param factories list of supported factories
  /// @param logging to write logs in console or not
  constructor(client: PublicClient, factories: FactoryV2[], logging = true) {
    this.client = client
    this.multiCallAggregator = new MultiCallAggregator(client)
    this.factories = factories
    this.logging = logging
    this.busyCounter = new Counter(() => {
      // do nothing
    })

    this.logFilter = new LogFilter(client, 200, UniV2EventsAbi, (logs?: Log[]) => {
      if (logs) {
        let eventKnown = 0
        let eventUnknown = 0
        let eventRemoved = 0
        logs.forEach((l) => {
          const addr = l.address.toLowerCase() as Address
          this.unexistedPools.delete(addr)
          const poolState = this.poolMap.get(addr)
          if (!poolState) {
            ++eventUnknown
            return
          }
          if (l.removed) {
            this.updatePoolState(poolState)
            ++eventRemoved
            return
          }
          const {
            args: { reserve0, reserve1 },
          } = decodeEventLog({ abi: UniV2EventsAbi, data: l.data, topics: l.topics })
          if (reserve0 !== undefined && reserve1 !== undefined) {
            poolState.poolCode.pool.updateReserves(BigNumber.from(reserve0), BigNumber.from(reserve1))
            poolState.isUpdated = true
          }
          ++eventKnown
        })
        const blockNumber = logs.length > 0 ? Number(logs[logs.length - 1].blockNumber || 0) : '<undefined>'
        const eventInfo = [
          eventKnown > 0 ? `${eventKnown} known` : '',
          eventUnknown > 0 ? `${eventUnknown} unknown` : '',
          eventRemoved > 0 ? `${eventRemoved} removed` : '',
        ]
          .filter((e) => e !== '')
          .join(', ')

        this.consoleLog(`Block ${blockNumber} ${logs.length} logs (${eventInfo}) jobs ${this.busyCounter.counter}`)
      } else {
        this.logFilter.start()
        warnLog(`Log collecting failed. Pools refetching`)
        Array.from(this.poolMap.values()).forEach((pc) => this.updatePoolState(pc))
      }
    })
  }

  async start() {}

  async updatePoolState(poolState: PoolState) {
    poolState.isUpdated = false
    const pool = poolState.poolCode.pool
    const reserves = await this.multiCallAggregator.callValue(pool.address as Address, getReservesAbi, 'getReserves')
    if (poolState.isUpdated) return // during await pool state was updated - don't touch it
    const [reserve0, reserve1] = reserves as [bigint, bigint]
    pool.updateReserves(BigNumber.from(reserve0), BigNumber.from(reserve1))
    poolState.isUpdated = true
  }

  getPoolsForTokens(tokens: Token[]): {
    prefetchedPools: ConstantProductPoolCode[]
    fetchingPools: Promise<ConstantProductPoolCode[]>
  } {
    const prefetchedPools: ConstantProductPoolCode[] = []
    const waitPools: Promise<ConstantProductPoolCode | undefined>[] = []
    for (let i = 0; i < tokens.length; ++i) {
      for (let j = i + 1; j < tokens.length; ++j) {
        if (tokens[i].address == tokens[j].address) continue
        const [t0, t1] = tokens[i].sortsBefore(tokens[j]) ? [tokens[i], tokens[j]] : [tokens[j], tokens[i]]
        this.factories.forEach((factory) => {
          const addr = this.computeV2Address(factory, t0, t1)
          const addrL = addr.toLowerCase() as Address
          const poolState = this.poolMap.get(addrL)
          if (poolState) {
            prefetchedPools.push(poolState.poolCode)
            return
          }
          if (this.unexistedPools.has(addrL)) return
          const promise = this.multiCallAggregator.callValue(addr, getReservesAbi, 'getReserves').then(
            (reserves) => {
              const [reserve0, reserve1] = reserves as [bigint, bigint]
              const pool = new ConstantProductRPool(
                addr,
                t0 as RToken,
                t1 as RToken,
                factory.fee,
                BigNumber.from(reserve0),
                BigNumber.from(reserve1)
              )
              const poolState: PoolState = {
                poolCode: new ConstantProductPoolCode(pool, factory.provider, factory.provider),
                isUpdated: true,
              }
              this.poolMap.set(addrL, poolState)
              return poolState.poolCode
            },
            () => {
              this.unexistedPools.add(addrL)
              return undefined
            }
          )
          waitPools.push(promise)
        })
      }
    }
    return {
      prefetchedPools,
      fetchingPools: Promise.all(waitPools).then(
        (pools) => pools.filter((p) => p !== undefined) as ConstantProductPoolCode[]
      ),
    }
  }

  async addAllPoolsFromFactories(): Promise<Address[]> {
    const poolListPromises = this.factories.map(async (factory) => {
      const poolsNumber = Number(
        (await this.multiCallAggregator.callValue(factory.address, UniV2FactoryAbi, 'allPairsLength')) as bigint
      )
      const poolsPromise = new Array(poolsNumber)
      for (let i = 0; i < poolsNumber; ++i) {
        poolsPromise[i] = this.multiCallAggregator.callValue(factory.address, UniV2FactoryAbi, 'allPairs', [i])
      }
      const pools = (await Promise.allSettled(poolsPromise))
        .map((r) =>
          r.status == 'fulfilled' && r.value !== '0x0000000000000000000000000000000000000000' ? r.value : undefined
        )
        .filter((r) => r !== undefined) as Address[]
      return pools
    })
    const poolLists = await Promise.all(poolListPromises)
    const pools = poolLists.reduce((a, b) => a.concat(b), [])
    return pools
  }

  computeV2Address(factory: FactoryV2, tokenA: Token, tokenB: Token): Address {
    const key = `${tokenA.address}${tokenB.address}${factory.address}`
    const cached = this.addressCache.get(key)
    if (cached) return cached
    const addr = computePairAddress({
      factoryAddress: factory.address,
      tokenA,
      tokenB,
      initCodeHashManualOverride: factory.initCodeHash,
    }) as Address
    this.addressCache.set(key, addr)
    return addr
  }

  consoleLog(log: string) {
    if (this.logging) console.log('ExtrV2: ' + log)
  }
}
