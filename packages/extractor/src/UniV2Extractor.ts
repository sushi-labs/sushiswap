import { constantProductPoolAbi, getReservesAbi } from '@sushiswap/abi'
import { computePairAddress } from '@sushiswap/amm'
import { Token } from '@sushiswap/currency'
import { ConstantProductPoolCode, LiquidityProviders } from '@sushiswap/router'
import { ConstantProductRPool, RToken } from '@sushiswap/tines'
import { BigNumber } from 'ethers'
import { Address, decodeEventLog, Log, parseAbiItem, PublicClient } from 'viem'

import { Counter } from './Counter'
import { LogFilter } from './LogFilter'
import { MultiCallAggregator } from './MulticallAggregator'
import { TokenManager } from './TokenManager'
import { warnLog } from './WarnLog'

export interface FactoryV2 {
  address: Address
  provider: LiquidityProviders
  fee: number
  initCodeHash: string
}

const enum PoolStatus {
  NoPool,
  IgnorePool,
  AddingPool,
  ValidPool,
  UpdatingPool,
}

interface PoolStateNotExist {
  status: PoolStatus.NoPool
}
interface PoolStateIgnorePool {
  status: PoolStatus.IgnorePool
}
interface PoolStateAddingPool {
  status: PoolStatus.AddingPool
  reserve0: bigint
  reserve1: bigint
}
interface PoolStateValidPool {
  status: PoolStatus.ValidPool | PoolStatus.UpdatingPool
  poolCode: ConstantProductPoolCode
}

type PoolState = PoolStateNotExist | PoolStateIgnorePool | PoolStateAddingPool | PoolStateValidPool

const UniV2EventsListenAbi = [parseAbiItem('event Sync(uint112 reserve0, uint112 reserve1)')]
const UniV2FactoryAbi = [
  parseAbiItem('function allPairsLength() external view returns (uint)'),
  parseAbiItem('function allPairs(uint256) external view returns (address)'),
]

// TODO: UniV3Ext price max-min change (+-10%)
// TODO: UniV3Ext watcher-something-all - ???
// TODO: UniV3Ext - to add "(337ms after demand)"
// TODO: pools cache - ?
// TODO: Back to LogFilter ?
export class UniV2Extractor {
  readonly multiCallAggregator: MultiCallAggregator
  readonly tokenManager: TokenManager

  readonly factories: FactoryV2[]
  readonly factoryMap: Map<string, FactoryV2> = new Map()

  readonly poolMap: Map<string, PoolState> = new Map()

  readonly logFilter: LogFilter
  readonly logging: boolean
  readonly taskCounter: Counter
  watchedPools = 0

  /// @param client
  /// @param factories list of supported factories
  /// @param logging to write logs in console or not
  constructor(
    client: PublicClient,
    factories: FactoryV2[],
    cacheDir: string,
    logDepth: number,
    logging = true,
    multiCallAggregator?: MultiCallAggregator,
    tokenManager?: TokenManager
  ) {
    this.multiCallAggregator = multiCallAggregator || new MultiCallAggregator(client)
    this.factories = factories
    factories.forEach((f) => this.factoryMap.set(f.address.toLowerCase(), f))
    this.tokenManager =
      tokenManager ||
      new TokenManager(this.multiCallAggregator, cacheDir, `uniV2Tokens-${this.multiCallAggregator.chainId}`)
    this.logging = logging
    this.taskCounter = new Counter(() => {
      // do nothing
    })

    this.logFilter = new LogFilter(client, logDepth, UniV2EventsListenAbi, (logs?: Log[]) => {
      if (logs) {
        let eventKnown = 0
        let eventUnknown = 0
        let eventIgnore = 0
        let eventRemoved = 0
        logs.forEach((l) => {
          const {
            args: { reserve0, reserve1 },
          } = decodeEventLog({ abi: UniV2EventsListenAbi, data: l.data, topics: l.topics })
          const poolState = this.poolMap.get(l.address.toLowerCase())
          if (!poolState || poolState.status == PoolStatus.NoPool) {
            ++eventUnknown
            if (reserve0 !== undefined && reserve1 !== undefined) this.addPoolByLog(l.address, reserve0, reserve1)
            return
          }
          if (poolState.status == PoolStatus.IgnorePool) {
            ++eventIgnore
            return
          }
          if (l.removed) {
            ++eventRemoved
            this.updatePoolState(poolState)
            return
          }
          if (reserve0 !== undefined && reserve1 !== undefined) {
            if (poolState.status == PoolStatus.AddingPool) {
              poolState.reserve0 = reserve0
              poolState.reserve1 = reserve1
            } else {
              poolState.poolCode.pool.updateReserves(BigNumber.from(reserve0), BigNumber.from(reserve1))
              poolState.status = PoolStatus.ValidPool
            }
          }
          ++eventKnown
        })
        const blockNumber = logs.length > 0 ? Number(logs[logs.length - 1].blockNumber || 0) : '<undefined>'
        const eventInfo = [
          eventKnown > 0 ? `${eventKnown} known` : '',
          eventIgnore > 0 ? `${eventIgnore} ignore` : '',
          eventUnknown > 0 ? `${eventUnknown} unknown` : '',
          eventRemoved > 0 ? `${eventRemoved} removed` : '',
        ]
          .filter((e) => e !== '')
          .join(', ')

        this.consoleLog(`Block ${blockNumber} ${logs.length} logs (${eventInfo}), jobs: ${this.taskCounter.counter}`)
      } else {
        this.logFilter.start()
        warnLog(`Log collecting failed. Pools refetching`)
        Array.from(this.poolMap.values()).forEach((pc) => this.updatePoolState(pc))
      }
    })
  }

  async start() {
    await this.tokenManager.addCachedTokens()
    await this.logFilter.start()
    warnLog('ExtractorV2 was started')
  }

  async updatePoolState(poolState: PoolState) {
    if (poolState.status !== PoolStatus.ValidPool) return
    this.taskCounter.inc()
    try {
      poolState.status = PoolStatus.UpdatingPool
      const pool = poolState.poolCode.pool
      const reserves = await this.multiCallAggregator.callValue(
        pool.address as Address,
        constantProductPoolAbi,
        'getReserves'
      )
      if (poolState.status !== PoolStatus.UpdatingPool) {
        // during await pool state was updated - don't touch it
        this.taskCounter.dec()
        return
      }
      const [reserve0, reserve1] = reserves as [bigint, bigint]
      pool.updateReserves(BigNumber.from(reserve0), BigNumber.from(reserve1))
      poolState.status = PoolStatus.ValidPool
    } catch (e) {
      warnLog(`Ext2 pool ${poolState.poolCode.pool.address} update fail`)
    }
    this.taskCounter.dec()
  }

  getPoolsForTokens(tokens: Token[]): {
    prefetchedPools: ConstantProductPoolCode[]
    fetchingPools: Promise<ConstantProductPoolCode[]> | undefined
  } {
    const prefetchedPools: ConstantProductPoolCode[] = []
    const waitPools: Promise<ConstantProductPoolCode | undefined>[] = []
    for (let i = 0; i < tokens.length; ++i) {
      for (let j = i + 1; j < tokens.length; ++j) {
        if (tokens[i].address == tokens[j].address) continue
        const [t0, t1] = tokens[i].sortsBefore(tokens[j]) ? [tokens[i], tokens[j]] : [tokens[j], tokens[i]]
        this.factories.forEach((factory) => {
          const addr = this.computeV2Address(factory, t0, t1)
          const addrL = addr.toLowerCase()
          const poolState = this.poolMap.get(addrL)
          if (poolState) {
            if (poolState.status == PoolStatus.ValidPool || poolState.status == PoolStatus.UpdatingPool)
              prefetchedPools.push(poolState.poolCode)
            return
          }
          const start = performance.now()
          const promise = this.multiCallAggregator.callValue(addr, getReservesAbi, 'getReserves').then(
            (reserves) => {
              const poolState2 = this.poolMap.get(addrL)
              if (poolState2) {
                // pool was created
                if (poolState2.status == PoolStatus.ValidPool || poolState2.status == PoolStatus.UpdatingPool)
                  return poolState2.poolCode
              }
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
                status: PoolStatus.ValidPool,
                poolCode: new ConstantProductPoolCode(pool, factory.provider, factory.provider),
              }
              this.poolMap.set(addrL, poolState)
              this.consoleLog(
                `add pool ${addr} (${Math.round(performance.now() - start)}ms, request), watched pools total: ${++this
                  .watchedPools}`
              )
              return poolState.poolCode
            },
            () => {
              this.poolMap.set(addrL, { status: PoolStatus.NoPool })
              return undefined
            }
          )
          waitPools.push(promise)
        })
      }
    }
    return {
      prefetchedPools,
      fetchingPools:
        waitPools.length != 0
          ? Promise.all(waitPools).then((pools) => pools.filter((p) => p !== undefined) as ConstantProductPoolCode[])
          : undefined,
    }
  }

  async addPoolsFromFactory(factoryAddr: Address, step = 1000, from = 0, quantity = -1) {
    const factory = this.factoryMap.get(factoryAddr.toLowerCase() as Address)
    if (!factory) return
    let to
    if (quantity < 0) {
      to = Number(
        (await this.multiCallAggregator.callValue(factory.address, UniV2FactoryAbi, 'allPairsLength')) as bigint
      )
    } else to = from + quantity
    for (let i = from; i < to; ) {
      const poolNum = Math.min(step, to - i)
      const promises = new Array<Promise<ConstantProductPoolCode | undefined>>(poolNum)
      for (let j = 0; j < poolNum; ++j)
        promises[j] = (async () => {
          try {
            const addr = await this.multiCallAggregator.callValue(factory.address, UniV2FactoryAbi, 'allPairs', [i++])
            const poolState = this.poolMap.get((addr as Address).toLowerCase())
            if (poolState)
              if (poolState.status != PoolStatus.NoPool && poolState.status == PoolStatus.IgnorePool) return
            const reserves = await this.multiCallAggregator.callValue(
              addr as Address,
              constantProductPoolAbi,
              'getReserves'
            )
            const [res0, res1] = reserves as [bigint, bigint]
            return await this.addPoolByLog(addr as Address, res0, res1, factory)
          } catch (e) {
            return
          }
        })()
      await Promise.all(promises)
      this.consoleLog(`Factory ${factoryAddr} pools ${i - poolNum}-${i} were downloaded`)
    }
  }

  async addPoolByLog(
    addr: Address,
    reserve0: bigint,
    reserve1: bigint,
    trustedFactory?: FactoryV2
  ): Promise<ConstantProductPoolCode | undefined> {
    const addrL = addr.toLowerCase()
    const poolState = this.poolMap.get(addrL)
    if (poolState) {
      if (poolState.status == PoolStatus.AddingPool) {
        poolState.reserve0 = reserve0
        poolState.reserve1 = reserve1
      }
      return
    }
    this.poolMap.set(addr.toLowerCase(), { status: PoolStatus.AddingPool, reserve0, reserve1 })
    let factory, token0, token1
    this.taskCounter.inc()
    const startTime = performance.now()
    try {
      if (trustedFactory) factory = trustedFactory
      else {
        const factoryAddr = await this.multiCallAggregator.callValue(addr, constantProductPoolAbi, 'factory')
        factory = this.factoryMap.get((factoryAddr as string).toLowerCase() as Address)
        if (!factory) {
          this.poolMap.set(addrL, { status: PoolStatus.IgnorePool })
          this.consoleLog(`other factory pool ${addr}`)
          this.taskCounter.dec()
          return
        }
      }
      const [token0Addr, token1Addr] = await Promise.all([
        this.multiCallAggregator.callValue(addr, constantProductPoolAbi, 'token0'),
        this.multiCallAggregator.callValue(addr, constantProductPoolAbi, 'token1'),
      ])
      const tokens = await Promise.all([
        this.tokenManager.findToken(token0Addr as Address),
        this.tokenManager.findToken(token1Addr as Address),
      ])
      token0 = tokens[0]
      token1 = tokens[1]
    } catch (e) {
      this.taskCounter.dec()
      warnLog(`Ext2 add pool ${addr} by log failed`)
      return
    }
    this.taskCounter.dec()
    const poolState2 = this.poolMap.get(addrL)
    if (!poolState2 || poolState2.status !== PoolStatus.AddingPool) return // pool status changed

    if (!token0 || !token1) {
      this.poolMap.set(addrL, { status: PoolStatus.IgnorePool })
      this.consoleLog(`ignore pool ${addr} (adding error)`)
      return
    }
    if (!trustedFactory) {
      const expectedPoolAddress = this.computeV2Address(factory as FactoryV2, token0, token1)
      if (expectedPoolAddress.toLowerCase() !== addrL) {
        this.poolMap.set(addrL, { status: PoolStatus.IgnorePool })
        this.consoleLog(`fake pool ${addr}`)
        return
      }
    }

    const [t0, t1] = token0.sortsBefore(token1) ? [token0, token1] : [token1, token0]
    const pool = new ConstantProductRPool(
      addr,
      t0 as RToken,
      t1 as RToken,
      factory.fee,
      BigNumber.from(poolState2.reserve0),
      BigNumber.from(poolState2.reserve1)
    )
    const poolState3: PoolState = {
      status: PoolStatus.ValidPool,
      poolCode: new ConstantProductPoolCode(pool, factory.provider, factory.provider),
    }
    this.poolMap.set(addrL, poolState3)
    const delay = Math.round(performance.now() - startTime)
    this.consoleLog(`add pool ${addr} (${delay}ms, logs), watched pools total: ${++this.watchedPools}`)
    return poolState3.poolCode
  }

  readonly addressCache: Map<string, Address> = new Map()
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
    if (this.logging) console.log('V2: ' + log)
  }
}
