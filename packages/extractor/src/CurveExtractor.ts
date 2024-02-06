import { CurvePoolCode } from '@sushiswap/router'
import { PublicClient } from 'viem'
import { Counter } from './Counter'
import { LogFilter2 } from './LogFilter2'
import { MultiCallAggregator } from './MulticallAggregator'
import { TokenManager } from './TokenManager'
import { warnLog } from './WarnLog'

const CurvePoolListNames = [
  'main', // all not-factory pools, including 3pool
  //'crypto', // all not-factory crypro pools
  'factory',  // pools of factories 0x0959158b6040d32d04c301a72cbfd6b39e21c9ae(3CRV) and 0xb9fc157394af804a3578134a6585c0dc9cc990d4 (EUR)
  'factory-crvusd', // pools for factory 0x4F8846Ae9380B90d2E71D5e3D042dff3E7ebb40d (crvUSD)
  //'factory-eywa',   // legacy - 0 pools
  //'factory-crypto',
  //'factory-tricrypto',
  'factory-stable-ng',
]

export interface CurveConfig {
  api: string
}

export class CurveExtractor {
  readonly api: string
  readonly multiCallAggregator: MultiCallAggregator
  readonly tokenManager: TokenManager

  readonly poolMap: Map<string, CurvePoolCode> = new Map()

  readonly logFilter: LogFilter2
  readonly logging: boolean
  readonly taskCounter: Counter

  /// @param client
  /// @param factories list of supported factories
  /// @param logging to write logs in console or not
  constructor(
    client: PublicClient,
    config: CurveConfig,
    logFilter: LogFilter2,
    tokenManager: TokenManager,
    logging = true,
    multiCallAggregator?: MultiCallAggregator,
  ) {
    this.multiCallAggregator =
      multiCallAggregator || new MultiCallAggregator(client)
    this.api = config.api
    this.tokenManager = tokenManager
    this.logging = logging
    this.taskCounter = new Counter(() => {
      // do nothing
    })

    this.logFilter = logFilter
    /*logFilter.addFilter(UniV2EventsListenAbi, (logs?: Log[]) => {
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
        warnLog(
          this.multiCallAggregator.chainId,
          'Log collecting failed. Pools refetching',
        )
        Array.from(this.poolMap.values()).forEach((pc) =>
          this.updatePoolState(pc),
        )
      }
    })*/
  }

  async start() {
    const pools = await this.gatherCurvePools()
    pools.forEach((p) => console.log(p))
  }

  async gatherCurvePools(): Promise<string[]> {
    const urlPrefix = this.api.endsWith('/') ? this.api : this.api + '/'
    let pools: string[] = []
    for (const l in CurvePoolListNames) {
      const url = urlPrefix + CurvePoolListNames[l]
      try {
        // @ts-ignore
        const listPoolsResp = await fetch(url)
        const listPools = (await listPoolsResp.json()) as {
          data?: { poolData?: { address: string }[] }
        }
        const poolData = listPools?.data?.poolData
        if (poolData === undefined) {
          warnLog(
            this.multiCallAggregator.chainId,
            `Crv pool list ${url} unexpected format`,
          )
          continue
        }
        const poolAddresses: string[] = poolData.map((pd) => pd.address)
        if (poolAddresses.some((a) => a === undefined)) {
          warnLog(
            this.multiCallAggregator.chainId,
            `Crv pool list ${url} unexpected format`,
          )
          continue
        }
        pools = pools.concat(pools, poolAddresses)
      } catch (_e) {
        warnLog(
          this.multiCallAggregator.chainId,
          `Crv pool list ${url} reading failed`,
        )
      }
    }
    return pools
  }
}
