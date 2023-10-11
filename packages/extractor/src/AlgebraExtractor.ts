import AlgebraFactory from '@cryptoalgebra/integral-core/artifacts/contracts/AlgebraFactory.sol/AlgebraFactory.json'
import AlgebraPool from '@cryptoalgebra/integral-core/artifacts/contracts/AlgebraPool.sol/AlgebraPool.json'
import { Token } from 'sushi/currency'
import { LiquidityProviders, PoolCode } from '@sushiswap/router'
import { Abi } from 'abitype'
import {
  Address,
  getAddress,
  Hex,
  keccak256,
  Log,
  PublicClient,
  encodeAbiParameters,
} from 'viem'

import { AlgebraEventsAbi, AlgebraPoolWatcher } from './AlgebraPoolWatcher'
import {
  AlgebraQualityChecker,
  PoolSyncState,
  QualityCheckerCallBackArg,
} from './AlgebraQualityChecker'
import { Counter } from './Counter'
import { LogFilter2 } from './LogFilter2'
import { MultiCallAggregator } from './MulticallAggregator'
import { PermanentCache } from './PermanentCache'
import { TokenManager } from './TokenManager'
import { warnLog } from './WarnLog'

export function getAlgebraPoolAddress(
  PoolDeployerAddress: string,
  tokenA: Address,
  tokenB: Address,
  POOL_INIT_CODE_HASH: Hex,
): Address {
  const [token0, token1] =
    tokenA.toLowerCase() < tokenB.toLowerCase()
      ? [tokenA, tokenB]
      : [tokenB, tokenA]
  const constructorArgumentsEncoded = encodeAbiParameters(
    [{name: 'TokenA', type: 'address'}, {name: 'TokenB', type: 'address'}],
    [token0, token1],
  )
  const create2Inputs = [
    '0xff',
    PoolDeployerAddress,
    // salt
    keccak256(constructorArgumentsEncoded as Hex),
    // init code. bytecode + constructor arguments
    POOL_INIT_CODE_HASH, //keccak256(bytecode),
  ]
  const sanitizedInputs = `0x${create2Inputs
    .map((i) => i.slice(2))
    .join('')}` as Hex
  return getAddress(`0x${keccak256(sanitizedInputs).slice(-40)}`)
}

export interface FactoryAlgebra {
  address: Address
  provider: LiquidityProviders
}

interface FactoryAlgebraFull {
  address: Address
  deployer: Address
  provider: LiquidityProviders
  initCodeHash: Hex
}

interface PoolInfo {
  address: Address
  token0: Token
  token1: Token
  factory: FactoryAlgebraFull
}

enum LogsProcessing {
  NotStarted = 'NotStarted',
  Starting = 'Starting',
  Started = 'Started',
}

interface PoolCacheRecord {
  address: Address
  token0: Address
  token1: Address
  factory: Address
}

export class AlgebraExtractor {
  factories: FactoryAlgebra[]
  factoriesFull: FactoryAlgebraFull[] = []
  factoryMap: Map<string, FactoryAlgebraFull> = new Map()
  tickHelperContract: Address
  multiCallAggregator: MultiCallAggregator
  tokenManager: TokenManager
  poolMap: Map<Address, AlgebraPoolWatcher> = new Map()
  emptyAddressSet: Set<Address> = new Set()
  poolPermanentCache: PermanentCache<PoolCacheRecord>
  otherFactoryPoolSet: Set<Address> = new Set()
  logFilter: LogFilter2
  logProcessingStatus = LogsProcessing.NotStarted
  logging: boolean
  taskCounter: Counter
  qualityChecker: AlgebraQualityChecker
  lastProcessdBlock = -1
  watchedPools = 0

  constructor(
    client: PublicClient,
    tickHelperContract: Address,
    factories: FactoryAlgebra[],
    cacheDir: string,
    logFilter: LogFilter2,
    logging = true,
    multiCallAggregator?: MultiCallAggregator,
    tokenManager?: TokenManager,
  ) {
    this.multiCallAggregator =
      multiCallAggregator || new MultiCallAggregator(client)
    this.tokenManager =
      tokenManager ||
      new TokenManager(
        this.multiCallAggregator,
        cacheDir,
        `AlgebraTokens-${this.multiCallAggregator.chainId}`,
      )
    this.tickHelperContract = tickHelperContract
    this.factories = factories
    this.poolPermanentCache = new PermanentCache(
      cacheDir,
      `AlgebraPools-${this.multiCallAggregator.chainId}`,
    )
    this.logging = logging
    this.taskCounter = new Counter(() => {
      //if (count == 0) this.consoleLog(`All pools were updated`)
    })
    this.qualityChecker = new AlgebraQualityChecker(
      200,
      (arg: QualityCheckerCallBackArg) => {
        const addr = arg.ethalonPool.address.toLowerCase() as Address
        if (arg.ethalonPool !== this.poolMap.get(addr)) return false // checked pool was replaced during checking
        if (arg.correctPool) this.poolMap.set(addr, arg.correctPool)
        this.consoleLog(
          `Pool ${arg.ethalonPool.address} quality check: ${arg.status} ` +
            `${arg.correctPool ? 'pool was updated ' : ''}` +
            `(${this.qualityChecker.totalMatchCounter}/${this.qualityChecker.totalCheckCounter})`,
        )
        if (
          arg.status !== PoolSyncState.Match &&
          arg.status !== PoolSyncState.ReservesMismatch
        )
          warnLog(
            this.multiCallAggregator.chainId,
            `Pool ${arg.ethalonPool.address} quality check: ${arg.status} ` +
              `${arg.correctPool ? 'pool was updated ' : ''}` +
              `(${this.qualityChecker.totalMatchCounter}/${this.qualityChecker.totalCheckCounter})`,
          )
        return true
      },
    )

    this.logFilter = logFilter
    logFilter.addFilter(AlgebraEventsAbi, (logs?: Log[]) => {
      if (logs) {
        const blockNumber =
          logs.length > 0
            ? Number(logs[logs.length - 1].blockNumber || 0)
            : '<undefined>'
        try {
          const logNames = logs.map((l) => this.processLog(l))
          this.consoleLog(
            `Block ${blockNumber} ${logNames.length} logs: [${logNames}], jobs: ${this.taskCounter.counter}`,
          )
          if (logs.length > 0)
            this.lastProcessdBlock = Number(
              logs[logs.length - 1].blockNumber || 0,
            )
        } catch (e) {
          warnLog(
            this.multiCallAggregator.chainId,
            `Block ${blockNumber} log process error: ${e}`,
          )
        }
      } else {
        this.logFilter.start()
        warnLog(
          this.multiCallAggregator.chainId,
          'Log collecting failed. Pools refetching',
        )
        Array.from(this.poolMap.values()).forEach((p) => p.updatePoolState())
      }
    })
  }

  // TODO: stop ?
  async start() {
    if (this.logProcessingStatus === LogsProcessing.NotStarted) {
      this.logProcessingStatus = LogsProcessing.Started
      const startTime = performance.now()
      this.logFilter.start()

      if (this.tokenManager.tokens.size === 0)
        await this.tokenManager.addCachedTokens()

      this.factoriesFull = await Promise.all(
        this.factories.map(async (f): Promise<FactoryAlgebraFull> => {
          const [deployer, initCodeHash] = await Promise.all([
            this.multiCallAggregator.callValue(
              f.address,
              AlgebraFactory.abi as Abi,
              'poolDeployer',
            ),
            this.multiCallAggregator.callValue(
              f.address,
              AlgebraFactory.abi as Abi,
              'POOL_INIT_CODE_HASH',
            ),
          ])
          return {
            ...f,
            deployer: deployer as Address,
            initCodeHash: initCodeHash as Hex,
          }
        }),
      )
      this.factoriesFull.forEach((f) =>
        this.factoryMap.set(f.address.toLowerCase(), f),
      )

      // Add cached pools to watching
      const cachedPools: Map<string, PoolInfo> = new Map() // map instead of array to avoid duplicates
      const cachedRecords = await this.poolPermanentCache.getAllRecords()
      cachedRecords.forEach((r) => {
        const token0 = this.tokenManager.getKnownToken(r.token0)
        const token1 = this.tokenManager.getKnownToken(r.token1)
        const factory = this.factoryMap.get(r.factory.toLowerCase())
        if (token0 && token1 && factory && r.address)
          cachedPools.set(r.address.toLowerCase(), {
            address: r.address,
            token0,
            token1,
            factory,
          })
      })
      cachedPools.forEach((p) => this.addPoolWatching(p, 'cache', false))
      this.consoleLog(`${cachedPools.size} pools were taken from cache`)
      warnLog(
        this.multiCallAggregator.chainId,
        `ExtractorAlg was started (${Math.round(
          performance.now() - startTime,
        )}ms)`,
        'info',
      )
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
      warnLog(
        this.multiCallAggregator.chainId,
        `Log processing for pool ${l.address} throwed an exception ${e}`,
      )
      return 'Exception!!!'
    }
  }

  addPoolWatching(
    p: PoolInfo,
    source: 'cache' | 'request' | 'logs',
    addToCache = true,
    startTime = 0,
  ) {
    if (this.logProcessingStatus !== LogsProcessing.Started) {
      throw new Error(
        'Pools can be added only after Log processing have been started',
      )
    }
    const addrL = p.address.toLowerCase() as Address
    const watcherExisted = this.poolMap.get(addrL)
    if (watcherExisted) return watcherExisted
    if (this.otherFactoryPoolSet.has(addrL)) return

    const [t0, t1] = p.token0.sortsBefore(p.token1)
      ? [p.token0, p.token1]
      : [p.token1, p.token0]

    startTime = startTime || performance.now()
    const expectedPoolAddress = this.computeAlgebraAddress(p.factory, t0, t1)
    if (addrL !== expectedPoolAddress.toLowerCase()) {
      this.consoleLog(`FakePool: ${p.address}`)
      this.otherFactoryPoolSet.add(addrL)
      return
    }
    const watcher = new AlgebraPoolWatcher(
      p.factory.provider,
      expectedPoolAddress,
      this.tickHelperContract,
      t0,
      t1,
      this.multiCallAggregator,
      this.taskCounter,
    )
    watcher.updatePoolState()
    this.poolMap.set(p.address.toLowerCase() as Address, watcher) // lowercase because incoming events have lowcase addresses ((
    if (addToCache)
      this.poolPermanentCache.add({
        address: expectedPoolAddress,
        token0: t0.address as Address,
        token1: t1.address as Address,
        factory: p.factory.address,
      })
    watcher.once('isUpdated', () => {
      ++this.watchedPools
      if (source !== 'cache') {
        const delay = Math.round(performance.now() - startTime)
        this.consoleLog(
          `add pool ${expectedPoolAddress} (${delay}ms, ${source}), watched pools total: ${this.watchedPools}`,
        )
      }
    })
    return watcher
  }

  getWatchersForTokens(tokensUnique: Token[]): {
    prefetched: AlgebraPoolWatcher[]
    fetching: Promise<AlgebraPoolWatcher | undefined>[]
  } {
    const startTime = performance.now()
    const prefetched: AlgebraPoolWatcher[] = []
    const fetching: Promise<AlgebraPoolWatcher | undefined>[] = []
    for (let i = 0; i < tokensUnique.length; ++i) {
      const t0 = tokensUnique[i]
      this.tokenManager.findToken(t0.address as Address) // to let save it in the cache
      for (let j = i + 1; j < tokensUnique.length; ++j) {
        const t1 = tokensUnique[j]
        this.factoriesFull.forEach((factory) => {
          const addr = this.computeAlgebraAddress(factory, t0, t1)
          const addrL = addr.toLowerCase() as Address
          const pool = this.poolMap.get(addrL)
          if (pool) {
            prefetched.push(pool)
            return
          }
          if (this.emptyAddressSet.has(addr)) return
          const promise = this.multiCallAggregator
            .callValue(
              factory.address,
              AlgebraFactory.abi as Abi,
              'poolByPair',
              [t0.address, t1.address],
            )
            .then(
              (checkedAddress) => {
                if (
                  checkedAddress ===
                  '0x0000000000000000000000000000000000000000'
                ) {
                  this.emptyAddressSet.add(addr)
                  return
                }
                const watcher = this.addPoolWatching(
                  { address: addr, token0: t0, token1: t1, factory },
                  'request',
                  true,
                  startTime,
                )
                return watcher
              },
              () => undefined,
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

  async addPoolByAddress(address: Address) {
    if (this.otherFactoryPoolSet.has(address.toLowerCase() as Address)) return
    if (this.multiCallAggregator.chainId === undefined) return
    try {
      this.emptyAddressSet.delete(address)
      const startTime = performance.now()
      const factoryAddress = await this.multiCallAggregator.callValue(
        address,
        AlgebraPool.abi as Abi,
        'factory',
      )
      const factory = this.factoryMap.get(
        (factoryAddress as Address).toLowerCase(),
      )
      if (factory !== undefined) {
        const [token0Address, token1Address] = await Promise.all([
          this.multiCallAggregator.callValue(
            address,
            AlgebraPool.abi as Abi,
            'token0',
          ),
          this.multiCallAggregator.callValue(
            address,
            AlgebraPool.abi as Abi,
            'token1',
          ),
        ])
        const [token0, token1] = await Promise.all([
          this.tokenManager.findToken(token0Address as Address),
          this.tokenManager.findToken(token1Address as Address),
        ])
        if (token0 && token1) {
          this.addPoolWatching(
            { address, token0, token1, factory },
            'logs',
            true,
            startTime,
          )
          return
        }
      }
    } catch (e) {
      // adding pool failed - let's add its address in otherFactoryPoolSet in order to not
      // spent resources for in the future
    }
    this.otherFactoryPoolSet.add(address.toLowerCase() as Address)
    this.consoleLog(
      `other factory pool ${address}, such pools known: ${this.otherFactoryPoolSet.size}`,
    )
  }

  getCurrentPoolCodes(): PoolCode[] {
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

  getTokensPoolsQuantity(tokenMap: Map<Token, number>) {
    const add = (token: Token) => {
      const num = tokenMap.get(token) || 0
      tokenMap.set(token, num + 1)
    }
    Array.from(this.poolMap.values()).forEach((p) => {
      add(p.token0)
      add(p.token1)
    })
  }

  readonly addressCache: Map<string, Address> = new Map()
  computeAlgebraAddress(
    factory: FactoryAlgebraFull,
    tokenA: Token,
    tokenB: Token,
  ): Address {
    const key = `${tokenA.address}${tokenB.address}${factory.address}`
    const cached = this.addressCache.get(key)
    if (cached) return cached
    const addr = getAlgebraPoolAddress(
      factory.deployer,
      tokenA.address as Address,
      tokenB.address as Address,
      factory.initCodeHash,
    )
    this.addressCache.set(key, addr)
    return addr
  }

  consoleLog(log: string) {
    if (this.logging)
      console.log(`Alg-${this.multiCallAggregator.chainId}: ${log}`)
  }
}
