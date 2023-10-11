import { getReservesAbi, tridentConstantPoolAbi } from 'sushi/abi'
import { computeSushiSwapV2PoolAddress } from '@sushiswap/v2-sdk'
import { Token } from 'sushi/currency'
import { ConstantProductPoolCode, LiquidityProviders } from '@sushiswap/router'
import { ConstantProductRPool, RToken } from '@sushiswap/tines'
import { Address, decodeEventLog, Log, parseAbiItem, PublicClient } from 'viem'

import { Counter } from './Counter'
import { LogFilter2 } from './LogFilter2'
import { MultiCallAggregator } from './MulticallAggregator'
import { PermanentCache } from './PermanentCache'
import { TokenManager } from './TokenManager'
import { repeat } from './Utils'
import { warnLog } from './WarnLog'

export interface FactoryV2 {
  address: Address
  provider: LiquidityProviders
  fee: number
  initCodeHash: string
}

enum PoolStatus {
  NoPool = 'NoPool',
  IgnorePool = 'IgnorePool',
  AddingPool = 'AddingPool',
  ValidPool = 'ValidPool',
  UpdatingPool = 'UpdatingPool',
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

interface PoolCacheRecord {
  address: Address
  token0: Address
  token1: Address
  factory: Address
}

type PoolState =
  | PoolStateNotExist
  | PoolStateIgnorePool
  | PoolStateAddingPool
  | PoolStateValidPool

const UniV2EventsListenAbi = [
  parseAbiItem('event Sync(uint112 reserve0, uint112 reserve1)'),
]
const UniV2FactoryAbi = [
  parseAbiItem('function allPairsLength() external view returns (uint)'),
  parseAbiItem('function allPairs(uint256) external view returns (address)'),
]

export class UniV2Extractor {
  readonly multiCallAggregator: MultiCallAggregator
  readonly tokenManager: TokenManager

  readonly factories: FactoryV2[]
  readonly factoryMap: Map<string, FactoryV2> = new Map()

  readonly poolMap: Map<string, PoolState> = new Map()

  readonly logFilter: LogFilter2
  readonly logging: boolean
  readonly taskCounter: Counter
  readonly poolPermanentCache: PermanentCache<PoolCacheRecord>
  watchedPools = 0

  /// @param client
  /// @param factories list of supported factories
  /// @param logging to write logs in console or not
  constructor(
    client: PublicClient,
    factories: FactoryV2[],
    cacheDir: string,
    logFilter: LogFilter2,
    logging = true,
    multiCallAggregator?: MultiCallAggregator,
    tokenManager?: TokenManager,
  ) {
    this.multiCallAggregator =
      multiCallAggregator || new MultiCallAggregator(client)
    this.factories = factories
    factories.forEach((f) => this.factoryMap.set(f.address.toLowerCase(), f))
    this.tokenManager =
      tokenManager ||
      new TokenManager(
        this.multiCallAggregator,
        cacheDir,
        `uniV2Tokens-${this.multiCallAggregator.chainId}`,
      )
    this.logging = logging
    this.taskCounter = new Counter(() => {
      // do nothing
    })
    this.poolPermanentCache = new PermanentCache(
      cacheDir,
      `uniV2Pools-${this.multiCallAggregator.chainId}`,
    )

    this.logFilter = logFilter
    logFilter.addFilter(UniV2EventsListenAbi, (logs?: Log[]) => {
      if (logs) {
        let eventKnown = 0
        let eventUnknown = 0
        let eventIgnore = 0
        let eventRemoved = 0
        logs.forEach((l) => {
          const {
            args: { reserve0, reserve1 },
          } = decodeEventLog({
            abi: UniV2EventsListenAbi,
            data: l.data,
            topics: l.topics,
          })
          const poolState = this.poolMap.get(l.address.toLowerCase())
          if (!poolState || poolState.status === PoolStatus.NoPool) {
            ++eventUnknown
            if (reserve0 !== undefined && reserve1 !== undefined)
              this.addPoolByLog(l.address, reserve0, reserve1)
            return
          }
          if (poolState.status === PoolStatus.IgnorePool) {
            ++eventIgnore
            return
          }
          if (l.removed) {
            ++eventRemoved
            this.updatePoolState(poolState)
            return
          }
          if (reserve0 !== undefined && reserve1 !== undefined) {
            if (poolState.status === PoolStatus.AddingPool) {
              poolState.reserve0 = reserve0
              poolState.reserve1 = reserve1
            } else {
              poolState.poolCode.pool.updateReserves(reserve0, reserve1)
              poolState.status = PoolStatus.ValidPool
            }
          }
          ++eventKnown
        })
        const blockNumber =
          logs.length > 0
            ? Number(logs[logs.length - 1].blockNumber || 0)
            : '<undefined>'
        const eventInfo = [
          eventKnown > 0 ? `${eventKnown} known` : '',
          eventIgnore > 0 ? `${eventIgnore} ignore` : '',
          eventUnknown > 0 ? `${eventUnknown} unknown` : '',
          eventRemoved > 0 ? `${eventRemoved} removed` : '',
        ]
          .filter((e) => e !== '')
          .join(', ')

        this.consoleLog(
          `Block ${blockNumber} ${logs.length} logs (${eventInfo}), jobs: ${this.taskCounter.counter}`,
        )
      } else {
        this.logFilter.start()
        warnLog(
          this.multiCallAggregator.chainId,
          'Log collecting failed. Pools refetching',
        )
        Array.from(this.poolMap.values()).forEach((pc) =>
          this.updatePoolState(pc),
        )
      }
    })
  }

  async start() {
    const startTime = performance.now()
    this.logFilter.start()
    if (this.tokenManager.tokens.size === 0)
      await this.tokenManager.addCachedTokens()

    // Add cached pools to watching
    const cachedPools: Set<string> = new Set()
    const cachedRecords = await this.poolPermanentCache.getAllRecords()
    const promises = cachedRecords.map(async (r) => {
      const token0 = this.tokenManager.getKnownToken(r.token0)
      const token1 = this.tokenManager.getKnownToken(r.token1)
      const factory = this.factoryMap.get(r.factory.toLowerCase())
      if (token0 && token1 && factory && r.address) {
        if (cachedPools.has(r.address.toLowerCase())) return
        cachedPools.add(r.address.toLowerCase())
        const startTime = performance.now()
        this.taskCounter.inc()
        try {
          const reserves = await this.multiCallAggregator.callValue(
            r.address,
            getReservesAbi,
            'getReserves',
          )
          const [reserve0, reserve1] = reserves as [bigint, bigint]
          this.addPoolWatching({
            address: r.address,
            token0,
            token1,
            reserve0,
            reserve1,
            factory,
            source: 'cache',
            addToCache: false,
            startTime,
          })
        } catch (e) {
          this.taskCounter.dec()
          warnLog(
            this.multiCallAggregator.chainId,
            `Ext2 pool ${r.address} reading from cache failed`,
          )
          return
        }
        this.taskCounter.dec()
      }
    })
    this.consoleLog(`${cachedPools.size} pools were taken from cache`)
    await Promise.allSettled(promises)

    warnLog(
      this.multiCallAggregator.chainId,
      `ExtractorV2 was started (${Math.round(
        performance.now() - startTime,
      )}ms)`,
      'info',
    )
  }

  async updatePoolState(poolState: PoolState) {
    if (poolState.status !== PoolStatus.ValidPool) return
    this.taskCounter.inc()
    try {
      poolState.status = PoolStatus.UpdatingPool
      const pool = poolState.poolCode.pool
      const reserves = await this.multiCallAggregator.callValue(
        pool.address as Address,
        tridentConstantPoolAbi,
        'getReserves',
      )
      if (poolState.status !== PoolStatus.UpdatingPool) {
        // during await pool state was updated - don't touch it
        this.taskCounter.dec()
        return
      }
      const [reserve0, reserve1] = reserves as [bigint, bigint]
      pool.updateReserves(reserve0, reserve1)
      poolState.status = PoolStatus.ValidPool
    } catch (e) {
      warnLog(
        this.multiCallAggregator.chainId,
        `Ext2 pool ${poolState.poolCode.pool.address} update fail`,
      )
    }
    this.taskCounter.dec()
  }

  getPoolsForTokens(tokensUnique: Token[]): {
    prefetched: ConstantProductPoolCode[]
    fetching: Promise<ConstantProductPoolCode | undefined>[]
  } {
    const prefetched: ConstantProductPoolCode[] = []
    const fetching: Promise<ConstantProductPoolCode | undefined>[] = []
    for (let i = 0; i < tokensUnique.length; ++i) {
      const t0 = tokensUnique[i]
      this.tokenManager.findToken(t0.address as Address) // to let save it in the cache
      for (let j = i + 1; j < tokensUnique.length; ++j) {
        const t1 = tokensUnique[j]
        this.factories.forEach((factory) => {
          const addr = this.computeV2Address(factory, t0, t1)
          const addrL = addr.toLowerCase()
          const poolState = this.poolMap.get(addrL)
          if (poolState) {
            if (
              poolState.status === PoolStatus.ValidPool ||
              poolState.status === PoolStatus.UpdatingPool
            )
              prefetched.push(poolState.poolCode)
            return
          }
          const startTime = performance.now()
          const promise = this.multiCallAggregator
            .callValue(addr, getReservesAbi, 'getReserves')
            .then(
              (reserves) => {
                const poolState2 = this.poolMap.get(addrL)
                if (poolState2) {
                  // pool was created
                  if (
                    poolState2.status === PoolStatus.ValidPool ||
                    poolState2.status === PoolStatus.UpdatingPool
                  )
                    return poolState2.poolCode
                }
                const [reserve0, reserve1] = reserves as [bigint, bigint]
                return this.addPoolWatching({
                  address: addr,
                  token0: t0,
                  token1: t1,
                  reserve0,
                  reserve1,
                  factory,
                  source: 'request',
                  addToCache: true,
                  startTime,
                })
              },
              () => {
                this.poolMap.set(addrL, { status: PoolStatus.NoPool })
                return undefined
              },
            )
          fetching.push(promise)
        })
      }
    }
    return {
      prefetched,
      fetching,
    }
  }

  async addPoolsFromFactory(
    factoryAddr: Address,
    step = 1000,
    from = 0,
    quantity = -1,
  ) {
    const factory = this.factoryMap.get(factoryAddr.toLowerCase() as Address)
    if (!factory) return
    let to
    if (quantity < 0) {
      to = Number(
        (await this.multiCallAggregator.callValue(
          factory.address,
          UniV2FactoryAbi,
          'allPairsLength',
        )) as bigint,
      )
    } else to = from + quantity
    for (let i = from; i < to; ) {
      const poolNum = Math.min(step, to - i)
      const promises = new Array<Promise<ConstantProductPoolCode | undefined>>(
        poolNum,
      )
      for (let j = 0; j < poolNum; ++j)
        promises[j] = (async () => {
          try {
            const addr = await this.multiCallAggregator.callValue(
              factory.address,
              UniV2FactoryAbi,
              'allPairs',
              [i++],
            )
            const poolState = this.poolMap.get((addr as Address).toLowerCase())
            if (poolState)
              if (
                poolState.status !== PoolStatus.NoPool &&
                poolState.status === PoolStatus.IgnorePool
              )
                return
            const reserves = await this.multiCallAggregator.callValue(
              addr as Address,
              tridentConstantPoolAbi,
              'getReserves',
            )
            const [res0, res1] = reserves as [bigint, bigint]
            return await this.addPoolByLog(addr as Address, res0, res1, factory)
          } catch (e) {
            return
          }
        })()
      await Promise.all(promises)
      this.consoleLog(
        `Factory ${factoryAddr} pools ${i - poolNum}-${i} were downloaded`,
      )
    }
  }

  async addPoolByLog(
    addr: Address,
    reserve0: bigint,
    reserve1: bigint,
    trustedFactory?: FactoryV2,
  ): Promise<ConstantProductPoolCode | undefined> {
    const addrL = addr.toLowerCase()
    const poolState = this.poolMap.get(addrL)
    if (poolState) {
      if (poolState.status === PoolStatus.AddingPool) {
        poolState.reserve0 = reserve0
        poolState.reserve1 = reserve1
      }
      return
    }
    this.poolMap.set(addrL, {
      status: PoolStatus.AddingPool,
      reserve0,
      reserve1,
    })
    let factory
    let token0
    let token1
    this.taskCounter.inc()
    const startTime = performance.now()
    try {
      if (trustedFactory) factory = trustedFactory
      else {
        const factoryAddr = await repeat(2, () =>
          this.multiCallAggregator.callValue(
            addr,
            tridentConstantPoolAbi,
            'factory',
          ),
        )

        this.multiCallAggregator.callValue(
          addr,
          tridentConstantPoolAbi,
          'factory',
        )
        factory = this.factoryMap.get(
          (factoryAddr as string).toLowerCase() as Address,
        )
        if (!factory) {
          this.poolMap.set(addrL, { status: PoolStatus.IgnorePool })
          this.consoleLog(`other factory pool ${addr}`)
          this.taskCounter.dec()
          return
        }
      }
      const [token0Addr, token1Addr] = await repeat(2, () => {
        return Promise.all([
          this.multiCallAggregator.callValue(
            addr,
            tridentConstantPoolAbi,
            'token0',
          ),
          this.multiCallAggregator.callValue(
            addr,
            tridentConstantPoolAbi,
            'token1',
          ),
        ])
      })
      const tokens = await Promise.all([
        this.tokenManager.findToken(token0Addr as Address),
        this.tokenManager.findToken(token1Addr as Address),
      ])
      token0 = tokens[0]
      token1 = tokens[1]
    } catch (e) {
      this.taskCounter.dec()
      warnLog(
        this.multiCallAggregator.chainId,
        `Ext2 add pool ${addr} by log failed: ${e}`,
      )
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
      const expectedPoolAddress = this.computeV2Address(
        factory as FactoryV2,
        token0,
        token1,
      )
      if (expectedPoolAddress.toLowerCase() !== addrL) {
        this.poolMap.set(addrL, { status: PoolStatus.IgnorePool })
        this.consoleLog(`fake pool ${addr}`)
        return
      }
      addr = expectedPoolAddress // in case if addr is lower case
    }

    return this.addPoolWatching({
      address: addr,
      token0,
      token1,
      reserve0: poolState2.reserve0,
      reserve1: poolState2.reserve1,
      factory,
      source: 'logs',
      addToCache: true,
      startTime,
    })
  }

  addPoolWatching(args: {
    address: Address
    token0: Token
    token1: Token
    reserve0: bigint
    reserve1: bigint
    factory: FactoryV2
    source: string
    addToCache: boolean
    startTime?: number
  }) {
    const [t0, t1] = args.token0.sortsBefore(args.token1)
      ? [args.token0, args.token1]
      : [args.token1, args.token0]

    const startTime =
      args.startTime === undefined ? performance.now() : args.startTime
    const pool = new ConstantProductRPool(
      args.address,
      t0 as RToken,
      t1 as RToken,
      args.factory.fee,
      args.reserve0,
      args.reserve1,
    )
    const poolState: PoolState = {
      status: PoolStatus.ValidPool,
      poolCode: new ConstantProductPoolCode(
        pool,
        args.factory.provider,
        args.factory.provider,
      ),
    }
    this.poolMap.set(args.address.toLowerCase(), poolState)
    if (args.addToCache)
      this.poolPermanentCache.add({
        address: args.address,
        token0: t0.address as Address,
        token1: t1.address as Address,
        factory: args.factory.address,
      })
    const delay = Math.round(performance.now() - startTime)
    ++this.watchedPools
    if (args.source !== 'cache')
      this.consoleLog(
        `add pool ${args.address} (${delay}ms, ${args.source}), watched pools total: ${this.watchedPools}`,
      )
    return poolState.poolCode
  }

  getCurrentPoolCodes(): ConstantProductPoolCode[] {
    const pools = Array.from(this.poolMap.values()).filter(
      (p) =>
        p.status === PoolStatus.ValidPool ||
        p.status === PoolStatus.UpdatingPool,
    ) as PoolStateValidPool[]
    return pools.map((p) => p.poolCode)
  }

  getTokensPoolsQuantity(tokenMap: Map<Token, number>) {
    const add = (token: RToken) => {
      const num = tokenMap.get(token as Token) || 0
      tokenMap.set(token as Token, num + 1)
    }
    Array.from(this.poolMap.values()).forEach((p) => {
      if (
        p.status === PoolStatus.ValidPool ||
        p.status === PoolStatus.UpdatingPool
      ) {
        add(p.poolCode.pool.token0)
        add(p.poolCode.pool.token1)
      }
    })
  }

  readonly addressCache: Map<string, Address> = new Map()
  computeV2Address(factory: FactoryV2, tokenA: Token, tokenB: Token): Address {
    const key = `${tokenA.address}${tokenB.address}${factory.address}`
    const cached = this.addressCache.get(key)
    if (cached) return cached
    const addr = computeSushiSwapV2PoolAddress({
      factoryAddress: factory.address,
      tokenA,
      tokenB,
      initCodeHashManualOverride: factory.initCodeHash,
    }) as Address
    this.addressCache.set(key, addr)
    return addr
  }

  consoleLog(log: string) {
    if (this.logging)
      console.log(`V2-${this.multiCallAggregator.chainId}: ${log}`)
  }
}
