import { Token } from '@sushiswap/currency'
import { PoolCode } from '@sushiswap/router'
import { FeeAmount } from '@sushiswap/v3-sdk'
import { AbiEvent } from 'abitype'
import { Address, Log, PublicClient } from 'viem'
import { Filter } from 'viem/dist/types/types/filter'

import { MultiCallAggregator } from './MulticallAggregator'
import { UniV3EventsAbi, UniV3PoolWatcher } from './UniV3PoolWatcher'

export interface PoolInfo {
  address: Address
  token0: Token
  token1: Token
  fee: FeeAmount
}

enum LogsProcessing {
  NotStarted,
  Starting,
  Started,
}

// TODO: PoolCode update cache with timer
// TODO: Known pools permanent cache
// TODO: factory list ?
// TODO: pools reserves update 1/1000 logs
export class UniV3Extractor {
  providerName: string
  tickHelperContract: Address
  client: PublicClient
  multiCallAggregator: MultiCallAggregator
  poolMap: Map<Address, UniV3PoolWatcher> = new Map()
  eventFilters: Filter[] = []
  logProcessGuard = false
  lastProcessdBlock = -1n
  logProcessingStatus = LogsProcessing.NotStarted

  constructor(client: PublicClient, providerName: string, tickHelperContract: Address) {
    this.providerName = providerName
    this.client = client
    this.multiCallAggregator = new MultiCallAggregator(client)
    this.tickHelperContract = tickHelperContract
  }

  // TODO: stop ?
  async start() {
    if (this.logProcessingStatus == LogsProcessing.NotStarted) {
      this.logProcessingStatus = LogsProcessing.Starting
      // Subscribe to each UniV3 event we are interested
      for (let i = 0; i < UniV3EventsAbi.length; ++i) {
        const filter = (await this.client.createEventFilter({ event: UniV3EventsAbi[i] as AbiEvent })) as Filter
        this.eventFilters.push(filter)
      }

      this.client.watchBlockNumber({
        onBlockNumber: async (blockNumber) => {
          if (!this.logProcessGuard) {
            this.logProcessGuard = true
            const promises = this.eventFilters.map((f) => this.client.getFilterChanges({ filter: f }))
            const logss = await Promise.all(promises)
            logss.forEach((logs) => {
              logs.forEach((l) => this.processLog(l))
            })
            this.lastProcessdBlock = blockNumber
            this.logProcessGuard = false
          } else {
            console.warn(`Log Filtering was skipped for block ${blockNumber}`)
          }
        },
      })
      this.logProcessingStatus = LogsProcessing.Started
    }
  }

  processLog(l: Log) {
    const pool = this.poolMap.get(l.address.toLowerCase() as Address)
    if (pool) pool.processLog(l)
    // else this.addPoolByAddress(l.address)
  }
  // async addPoolsForTokens(tokens: Token[], factory: Address) {
  //   let pools: PoolInfo[] = []
  //   for (let i = 0; i < tokens.length; ++i) {
  //     for (let j = i + 1; j < tokens.length; ++j) {
  //       const tokenPools: PoolInfo[] = await this.client.readContract({
  //         address: factory,
  //         // tokens order !!!
  //       })
  //       pools = pools.concat(tokenPools)
  //     }
  //   }

  //   pools.forEach((p) => this.addPoolWatching(p))
  // }

  addPoolWatching(p: PoolInfo) {
    if (this.logProcessingStatus !== LogsProcessing.Started) {
      throw new Error('Pools can be added after Log processing have been started')
    }
    if (!this.poolMap.has(p.address.toLowerCase() as Address)) {
      const watcher = new UniV3PoolWatcher(
        this.providerName,
        p.address,
        this.tickHelperContract,
        p.token0,
        p.token1,
        p.fee,
        this.multiCallAggregator
      )
      watcher.updatePoolState()
      this.poolMap.set(p.address.toLowerCase() as Address, watcher) // lowercase because incoming events have lowcase addresses ((
    }
  }

  // async addPoolByAddress(addr: Address) {}

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
}
