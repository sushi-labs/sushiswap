import { Token } from '@sushiswap/currency'
import { PoolCode } from '@sushiswap/router'
import { FeeAmount } from '@sushiswap/v3-sdk'
import { AbiEvent } from 'abitype'
import { Address, PublicClient } from 'viem'
import { Filter } from 'viem/dist/types/types/filter'

import { MultiCallAggregator } from './MulticallAggregator'
import { UniV3EventsAbi, UniV3PoolWatcher } from './UniV3PoolWatcher'

export interface PoolInfo {
  address: Address
  token0: Token
  token1: Token
  fee: FeeAmount
}

// TODO: PoolCode update cache wuth timer
export class UniV3Extractor {
  providerName: string
  tickHelperContract: Address
  client: PublicClient
  multiCallAggregator: MultiCallAggregator
  poolMap: Map<Address, UniV3PoolWatcher> = new Map()
  eventFilters: Filter[] = []
  logProcessGuard = false

  constructor(client: PublicClient, providerName: string, tickHelperContract: Address) {
    this.providerName = providerName
    this.client = client
    this.multiCallAggregator = new MultiCallAggregator(client)
    this.tickHelperContract = tickHelperContract
  }

  // TODO: stop ?
  // TODO: protection from restarting
  async start(pools: PoolInfo[]) {
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
            logs.forEach((l) => {
              const pool = this.poolMap.get(l.address)
              if (pool) pool.processLog(l)
            })
          })
          this.logProcessGuard = false
        } else {
          console.warn(`Log Filtering was skipped for block ${blockNumber}`)
        }
      },
    })

    pools.forEach((p) => {
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
      this.poolMap.set(p.address, watcher)
    })
  }

  getPoolCodes(): PoolCode[] {
    return Array.from(this.poolMap.values())
      .map((p) => p.getPoolCode())
      .filter((pc) => pc !== undefined) as PoolCode[]
  }
}
