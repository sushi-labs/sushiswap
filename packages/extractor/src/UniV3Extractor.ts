import { Token } from '@sushiswap/currency'
import { LiquidityProviders, PoolCode } from '@sushiswap/router'
import { computePoolAddress, FeeAmount } from '@sushiswap/v3-sdk'
import IUniswapV3Factory from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'
import IUniswapV3Pool from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json'
import { Abi } from 'abitype'
import { Address, Log, PublicClient } from 'viem'

import { Counter } from './Counter'
import { LogFilter } from './LogFilter'
import { MultiCallAggregator } from './MulticallAggregator'
import { PermanentCache } from './PermanentCache'
import { QualityChecker, QualityCheckerCallBackArg } from './QualityChecker'
import { TokenManager } from './TokenManager'
import { UniV3EventsAbi, UniV3PoolWatcher } from './UniV3PoolWatcher'
import { warnLog } from './WarnLog'

export interface FactoryV3 {
  address: Address
  provider: LiquidityProviders
  initCodeHash: string
}

export interface PoolInfo {
  address: Address
  token0: Token
  token1: Token
  fee: FeeAmount
  factory: FactoryV3
}

enum LogsProcessing {
  NotStarted,
  Starting,
  Started,
}

interface PoolCacheRecord {
  address: Address
  token0: Address
  token1: Address
  fee: number
  factory: Address
}

// Usage recomendation:
//   - launch in a separate thread or process, maybe with higher priority. Don't launch anything network or processor
//     consuming in the same thread
//   - provide good blockchain provider account (Alchemy/Infura/...)
//   - don't call getPoolCodes() too often. It consumes much. Good practice is no do it once per second or so
//   - direct logs (std output) to console
//   - direct warnings (std error) to a file
export class UniV3Extractor {
  factories: FactoryV3[]
  factoryMap: Map<string, FactoryV3> = new Map()
  tickHelperContract: Address
  client: PublicClient
  multiCallAggregator: MultiCallAggregator
  tokenManager: TokenManager
  poolMap: Map<Address, UniV3PoolWatcher> = new Map()
  poolPermanentCache: PermanentCache<PoolCacheRecord>
  otherFactoryPoolSet: Set<Address> = new Set()
  logFilter: LogFilter
  logProcessingStatus = LogsProcessing.NotStarted
  logging: boolean
  busyCounter: Counter
  qualityChecker: QualityChecker
  lastProcessdBlock = -1

  /// @param client
  /// @param tickHelperContract address of helper contract for pool's ticks download
  /// @param factories list of supported factories
  /// @param cacheDir directory for cache. Extremely recomended
  /// @param logging to write logs in console or not
  constructor(
    client: PublicClient,
    tickHelperContract: Address,
    factories: FactoryV3[],
    cacheDir: string,
    logDepth: number,
    logging = true
  ) {
    this.client = client
    this.multiCallAggregator = new MultiCallAggregator(client)
    this.tokenManager = new TokenManager(this.multiCallAggregator, cacheDir, `uniV3Tokens-${this.client.chain?.id}`)
    this.tickHelperContract = tickHelperContract
    this.factories = factories
    factories.forEach((f) => this.factoryMap.set(f.address.toLowerCase(), f))
    this.poolPermanentCache = new PermanentCache(cacheDir, `uniV3Pools-${this.client.chain?.id}`)
    this.logging = logging
    this.busyCounter = new Counter(() => {
      //if (count == 0) this.consoleLog(`All pools were updated`)
    })
    this.qualityChecker = new QualityChecker(200, (arg: QualityCheckerCallBackArg) => {
      const addr = arg.ethalonPool.address.toLowerCase() as Address
      if (arg.ethalonPool != this.poolMap.get(addr)) return false // checked pool was replaced during checking
      if (arg.correctPool) this.poolMap.set(addr, arg.correctPool)
      this.consoleLog(
        `Pool ${arg.ethalonPool.address} quality check: ${arg.status} ` +
          `${arg.correctPool ? 'pool was updated ' : ''}` +
          `(${this.qualityChecker.totalMatchCounter}/${this.qualityChecker.totalCheckCounter})`
      )
      return true
    })

    this.logFilter = new LogFilter(client, logDepth, UniV3EventsAbi, (logs?: Log[]) => {
      if (logs) {
        const blockNumber = logs.length > 0 ? Number(logs[logs.length - 1].blockNumber || 0) : '<undefined>'
        try {
          const logNames = logs.map((l) => this.processLog(l))
          this.consoleLog(
            `Block ${blockNumber} ${logNames.length} logs: [${logNames}] jobs: ${this.busyCounter.counter}`
          )
          if (logs.length > 0) this.lastProcessdBlock = Number(logs[logs.length - 1].blockNumber || 0)
        } catch (e) {
          warnLog(`Block ${blockNumber} log process error: ${e}`)
        }
      } else {
        this.logFilter.start()
        warnLog(`Log collecting failed. Pools refetching`)
        Array.from(this.poolMap.values()).forEach((p) => p.updatePoolState())
      }
    })
  }

  // TODO: stop ?
  async start() {
    if (this.logProcessingStatus == LogsProcessing.NotStarted) {
      warnLog('Extractor was started')
      this.logFilter.start()
      this.logProcessingStatus = LogsProcessing.Started

      // Add cached pools to watching
      const cachedPools: Map<string, PoolInfo> = new Map() // map instead of array to avoid duplicates
      await this.tokenManager.addCachedTokens()
      const cachedRecords = await this.poolPermanentCache.getAllRecords()
      cachedRecords.forEach((r) => {
        const token0 = this.tokenManager.getKnownToken(r.token0)
        const token1 = this.tokenManager.getKnownToken(r.token1)
        const factory = this.factoryMap.get(r.factory.toLowerCase())
        if (token0 && token1 && factory && r.address && r.fee)
          cachedPools.set(r.address.toLowerCase(), {
            address: r.address,
            token0,
            token1,
            fee: r.fee,
            factory,
          })
      })
      cachedPools.forEach((p) => this.addPoolWatching(p, false))
      this.consoleLog(`${cachedPools.size} pools were taken from cache`)
    }
  }

  processLog(l: Log): string {
    try {
      const pool = this.poolMap.get(l.address.toLowerCase() as Address)
      if (pool) {
        this.qualityChecker.processLog(l, pool)
        return pool.processLog(l)
      } else this.addPoolByAddress(l.address)
      return 'UnknPool'
    } catch (e) {
      warnLog(`Log processing for pool ${l.address} throwed an exception ${e}`)
      return 'Exception!!!'
    }
  }

  async addPoolsForTokens(tokens: Token[]) {
    this.tokenManager.addTokens(tokens)
    const fees = Object.values(FeeAmount).filter((fee) => typeof fee == 'number')
    const promises: Promise<Address>[] = []
    for (let i = 0, promiseIndex = 0; i < tokens.length; ++i) {
      for (let j = i + 1; j < tokens.length; ++j) {
        const [a0, a1] = tokens[i].sortsBefore(tokens[j])
          ? [tokens[i].address, tokens[j].address]
          : [tokens[j].address, tokens[i].address]
        fees.forEach((fee) => {
          this.factories.forEach((factory) => {
            promises[promiseIndex++] = this.multiCallAggregator.callValue(
              factory.address,
              IUniswapV3Factory.abi as Abi,
              'getPool',
              [a0, a1, fee]
            )
          })
        })
      }
    }

    const result = await Promise.all(promises)

    const pools: PoolInfo[] = []
    for (let i = 0, promiseIndex = 0; i < tokens.length; ++i) {
      for (let j = i + 1; j < tokens.length; ++j) {
        const [token0, token1] = tokens[i].sortsBefore(tokens[j]) ? [tokens[i], tokens[j]] : [tokens[j], tokens[i]]
        fees.forEach((fee) => {
          this.factories.forEach((factory) => {
            const address = result[promiseIndex++]
            if (address !== '0x0000000000000000000000000000000000000000')
              pools.push({
                address,
                token0,
                token1,
                fee: fee as FeeAmount,
                factory,
              })
          })
        })
      }
    }

    pools.forEach((p) => this.addPoolWatching(p))
  }

  addPoolWatching(p: PoolInfo, addToCache = true) {
    if (this.logProcessingStatus !== LogsProcessing.Started) {
      throw new Error('Pools can be added only after Log processing have been started')
    }
    const addrL = p.address.toLowerCase() as Address
    if (!this.poolMap.has(addrL) && !this.otherFactoryPoolSet.has(addrL)) {
      const expectedPoolAddress = this.computeV3Address(p.factory, p.token0, p.token1, p.fee)
      if (addrL !== expectedPoolAddress.toLowerCase()) {
        this.consoleLog(`FakePool: ${p.address}`)
        this.otherFactoryPoolSet.add(addrL)
        return
      }
      const watcher = new UniV3PoolWatcher(
        p.factory.provider,
        p.address,
        this.tickHelperContract,
        p.token0,
        p.token1,
        p.fee,
        this.multiCallAggregator,
        this.busyCounter
      )
      watcher.updatePoolState()
      this.poolMap.set(p.address.toLowerCase() as Address, watcher) // lowercase because incoming events have lowcase addresses ((
      if (addToCache)
        this.poolPermanentCache.add({
          address: p.address,
          token0: p.token0.address as Address,
          token1: p.token1.address as Address,
          fee: p.fee,
          factory: p.factory.address,
        })
      this.consoleLog(`add pool ${p.address}, watched pools total: ${this.poolMap.size}`)
      return watcher
    }
  }

  getPoolsForTokens(tokens: Token[]): {
    prefetchedPools: UniV3PoolWatcher[]
    fetchingPools: Promise<UniV3PoolWatcher[]>
  } {
    const prefetchedPools: UniV3PoolWatcher[] = []
    const waitPools: Promise<UniV3PoolWatcher | undefined>[] = []
    const fees = Object.values(FeeAmount).filter((fee) => typeof fee == 'number') as FeeAmount[]
    for (let i = 0; i < tokens.length; ++i) {
      for (let j = i + 1; j < tokens.length; ++j) {
        if (tokens[i].address == tokens[j].address) continue
        const [t0, t1] = tokens[i].sortsBefore(tokens[j]) ? [tokens[i], tokens[j]] : [tokens[j], tokens[i]]
        this.factories.forEach((factory) => {
          fees.forEach((fee) => {
            const addr = this.computeV3Address(factory, t0, t1, fee)
            const addrL = addr.toLowerCase() as Address
            const pool = this.poolMap.get(addrL)
            if (pool) {
              prefetchedPools.push(pool)
              return
            }
            const promise = this.multiCallAggregator
              .callValue(factory.address, IUniswapV3Factory.abi as Abi, 'getPool', [t0.address, t1.address, fee])
              .then(
                (checkedAddress) => {
                  if (checkedAddress == '0x0000000000000000000000000000000000000000') return
                  const watcher = this.addPoolWatching({ address: addr, token0: t0, token1: t1, fee, factory })
                  return watcher
                },
                () => undefined
              )
            waitPools.push(promise)
          })
        })
      }
    }
    return {
      prefetchedPools,
      fetchingPools: Promise.all(waitPools).then((pools) => pools.filter((p) => p !== undefined) as UniV3PoolWatcher[]),
    }
  }

  async addPoolByAddress(address: Address) {
    if (this.otherFactoryPoolSet.has(address.toLowerCase() as Address)) return
    if (this.client.chain?.id === undefined) return

    const factoryAddress = await this.multiCallAggregator.callValue(address, IUniswapV3Pool.abi as Abi, 'factory')
    const factory = this.factoryMap.get((factoryAddress as Address).toLowerCase())
    if (factory !== undefined) {
      const [token0Address, token1Address, fee] = await Promise.all([
        this.multiCallAggregator.callValue(address, IUniswapV3Pool.abi as Abi, 'token0'),
        this.multiCallAggregator.callValue(address, IUniswapV3Pool.abi as Abi, 'token1'),
        this.multiCallAggregator.callValue(address, IUniswapV3Pool.abi as Abi, 'fee'),
      ])
      const [token0, token1] = await Promise.all([
        this.tokenManager.findToken(token0Address as Address),
        this.tokenManager.findToken(token1Address as Address),
      ])
      if (token0 && token1) {
        this.addPoolWatching({ address, token0, token1, fee: fee as FeeAmount, factory })
        return
      }
    }
    this.otherFactoryPoolSet.add(address.toLowerCase() as Address)
    this.consoleLog(`other factory pool ${address}, such pools known: ${this.otherFactoryPoolSet.size}`)
  }

  getPoolCodes(): PoolCode[] {
    return Array.from(this.poolMap.values())
      .map((p) => p.getPoolCode())
      .filter((pc) => pc !== undefined) as PoolCode[]
  }

  // only for testing
  getStablePoolCodes(): PoolCode[] {
    return Array.from(this.poolMap.values())
      .map((p) => (p.isStable() ? p.getPoolCode() : undefined))
      .filter((pc) => pc !== undefined) as PoolCode[]
  }

  readonly addressCache: Map<string, Address> = new Map()
  computeV3Address(factory: FactoryV3, tokenA: Token, tokenB: Token, fee: FeeAmount): Address {
    const key = `${tokenA.address}${tokenB.address}${fee}${factory.address}`
    const cached = this.addressCache.get(key)
    if (cached) return cached
    const addr = computePoolAddress({
      factoryAddress: factory.address,
      tokenA,
      tokenB,
      fee,
      initCodeHashManualOverride: factory.initCodeHash,
    }) as Address
    this.addressCache.set(key, addr)
    return addr
  }

  consoleLog(log: string) {
    if (this.logging) console.log('Extractor: ' + log)
  }
}
