import { getReservesAbi } from '@sushiswap/abi'
import { computePairAddress } from '@sushiswap/amm'
import { Token } from '@sushiswap/currency'
import { ConstantProductPoolCode, LiquidityProviders, PoolCode } from '@sushiswap/router'
import { ConstantProductRPool, RToken } from '@sushiswap/tines'
import { BigNumber } from 'ethers'
import { Address, decodeEventLog, Log, parseAbiItem, PublicClient } from 'viem'

import { Counter } from './Counter'
import { LogFilter } from './LogFilter'
import { MultiCallAggregator } from './MulticallAggregator'
import { warnLog } from './WarnLog'

export interface Factory {
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

  async addPoolsForTokens(tokens: Token[]) {
    const promises: Promise<ConstantProductPoolCode>[] = []
    for (let i = 0, promiseIndex = 0; i < tokens.length; ++i) {
      for (let j = i + 1; j < tokens.length; ++j) {
        this.factories.forEach((factory) => {
          const [t0, t1] = tokens[i].sortsBefore(tokens[j]) ? [tokens[i], tokens[j]] : [tokens[j], tokens[i]]
          const addr = computePairAddress({
            factoryAddress: factory.address,
            tokenA: t0,
            tokenB: t1,
            initCodeHashManualOverride: factory.initCodeHash,
          }) as Address
          const poolState = this.poolMap.get(addr.toLowerCase() as Address)
          if (!poolState) {
            promises[promiseIndex++] = this.multiCallAggregator
              .callValue(addr, getReservesAbi, 'getReserves')
              .then((reserves) => {
                // TODO: keep a set of unexisted pools
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
                this.poolMap.set(addr.toLowerCase() as Address, poolState)
                return poolState.poolCode
              })
          } else {
            promises[promiseIndex++] = Promise.resolve(poolState.poolCode)
          }
        })
      }
    }

    const result = await Promise.allSettled(promises)

    return result.map((r) => (r.status == 'fulfilled' ? r.value : undefined)).filter((r) => r !== undefined)
  }

  consoleLog(log: string) {
    if (this.logging) console.log('ExtrV2: ' + log)
  }
}
