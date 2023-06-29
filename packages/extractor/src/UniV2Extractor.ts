import { getReservesAbi } from '@sushiswap/abi'
import { ConstantProductPoolCode } from '@sushiswap/router'
import { BigNumber } from 'ethers'
import { Address, decodeEventLog, Log, parseAbiItem, PublicClient } from 'viem'

import { Counter } from './Counter'
import { LogFilter } from './LogFilter'
import { MultiCallAggregator } from './MulticallAggregator'
import { warnLog } from './WarnLog'

export interface Factory {
  address: Address
  providerName: string
  fee: number
}

interface PoolState {
  poolCode: ConstantProductPoolCode
  isUpdated: boolean
}

const UniV2EventsAbi = [parseAbiItem('event Sync(uint112 reserve0, uint112 reserve1)')]

export class UniV2Extractor {
  factories: Factory[]
  client: PublicClient
  multiCallAggregator: MultiCallAggregator
  poolMap: Map<Address, PoolState> = new Map()
  logFilter: LogFilter
  logging: boolean
  busyCounter: Counter

  /// @param client
  /// @param factories list of supported factories
  /// @param logging to write logs in console or not
  constructor(client: PublicClient, factories: Factory[], logging = true) {
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
          const poolState = this.poolMap.get(l.address.toLowerCase() as Address)
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
          .join(',')

        this.consoleLog(`Block ${blockNumber} ${logs.length} logs (${eventInfo}) jobs ${this.busyCounter.counter}`)
      } else {
        this.logFilter.start()
        warnLog(`Log collecting failed. Pools refetching`)
        Array.from(this.poolMap.values()).forEach((pc) => this.updatePoolState(pc))
      }
    })
  }

  async updatePoolState(poolState: PoolState) {
    poolState.isUpdated = false
    const pool = poolState.poolCode.pool
    const reserves = await this.multiCallAggregator.callValue(pool.address as Address, getReservesAbi, 'getReserves')
    if (poolState.isUpdated) return // during await pool state was updated - don't touch it
    const [reserve0, reserve1] = reserves as [bigint, bigint]
    pool.updateReserves(BigNumber.from(reserve0), BigNumber.from(reserve1))
    poolState.isUpdated = true
  }

  consoleLog(log: string) {
    if (this.logging) console.log('ExtrV2: ' + log)
  }
}
