import { EventEmitter } from 'node:events'
import { Abi, Address, parseAbiItem } from 'abitype'
import { Token } from 'sushi/currency'
import { LiquidityProviders, PoolCode, UniV4PoolCode } from 'sushi/router'
import { CLTick, RToken, UniV4Pool } from 'sushi/tines'
import { Log, decodeEventLog, parseAbi } from 'viem'
import { Counter } from './Counter.js'
import { Logger } from './Logger.js'
import { MultiCallAggregator } from './MulticallAggregator.js'
import { UniV4WordLoadManager } from './UniV4WordLoadManager.js'

interface UniV4PoolSelfState {
  blockNumber: number
  tick: number
  liquidity: bigint
  sqrtPriceX96: bigint
}

const poolManagerAbi: Abi = parseAbi([
  'function getSlot0(bytes32 id) view returns (uint160 sqrtPriceX96, int24 tick, uint8 protocolSwapFee, uint8 protocolWithdrawFee, uint8 hookSwapFee, uint8 hookWithdrawFee)',
  'function getLiquidity(bytes32 id) view returns (uint128 liquidity)',
])

export const UniV4ChangeStateEventsAbi = [
  parseAbiItem(
    'event ModifyPosition(bytes32 indexed id, address indexed sender, int24 tickLower, int24 tickUpper, int256 liquidityDelta)',
  ),
  parseAbiItem(
    'event Swap(bytes32 indexed id, address indexed sender, int128 amount0, int128 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick, uint24 fee)',
  ),
]

export enum UniV4PoolWatcherStatus {
  Failed = 'Failed',
  Nothing = 'Nothing',
  Something = 'Something',
  All = 'All',
}

// TODO: more ticks and priority depending on resources
// TODO: gather statistics how often (blockNumber < this.latestEventBlockNumber)
// event PoolCodeWasChanged is emitted each time getPoolCode() returns another pool (lastPoolCode changed)
export class UniV4PoolWatcher extends EventEmitter {
  // Pool constant params
  id: string
  token0: Token
  token1: Token
  fee: number
  spacing: number
  hooks: Address | undefined

  // Pool mutable state
  state?: UniV4PoolSelfState

  address: Address
  tickHelperContract: Address
  provider: LiquidityProviders
  client: MultiCallAggregator
  wordLoadManager: UniV4WordLoadManager
  updatePoolStateGuard = false
  busyCounter?: Counter
  private lastPoolCode?: PoolCode
  status: UniV4PoolWatcherStatus = UniV4PoolWatcherStatus.Nothing
  latestEventBlockNumber = 0

  constructor({
    provider,
    address,
    id,
    tickHelperContract,
    token0,
    token1,
    fee,
    spacing,
    hooks,
    client,
    busyCounter,
  }: {
    provider: LiquidityProviders
    address: Address
    id: string
    tickHelperContract: Address
    token0: Token
    token1: Token
    fee: number
    spacing: number
    hooks: Address | undefined
    client: MultiCallAggregator
    busyCounter?: Counter
  }) {
    super()
    this.provider = provider
    this.address = address
    this.id = id
    this.tickHelperContract = tickHelperContract
    this.token0 = token0
    this.token1 = token1
    this.fee = fee
    this.spacing = spacing
    this.hooks = hooks

    this.client = client
    this.wordLoadManager = new UniV4WordLoadManager(
      address,
      id,
      this.spacing,
      tickHelperContract,
      client,
      busyCounter,
    )
    this.wordLoadManager.on('ticksChanged', () => {
      this._poolWasChanged()
    })
    this.busyCounter = busyCounter
  }

  async updatePoolState() {
    if (!this.updatePoolStateGuard) {
      this.updatePoolStateGuard = true
      if (this.busyCounter) this.busyCounter.inc()
      try {
        for (;;) {
          const {
            blockNumber,
            returnValues: [slot0, liquidity],
          } = await this.client.callSameBlock([
            {
              address: this.address,
              abi: poolManagerAbi,
              functionName: 'getSlot0',
              args: [this.id],
            },
            {
              address: this.address,
              abi: poolManagerAbi,
              functionName: 'getLiquidity',
              args: [this.id],
            },
          ])
          if (blockNumber < this.latestEventBlockNumber) continue // later events already have came

          const [sqrtPriceX96, tick] = slot0 as [bigint, number]
          this.state = {
            blockNumber,
            tick: Math.floor(tick / this.spacing) * this.spacing,
            liquidity: liquidity as bigint,
            sqrtPriceX96: sqrtPriceX96 as bigint,
          }
          this._poolWasChanged()

          if (this.getStatus() === UniV4PoolWatcherStatus.Nothing) {
            this.wordLoadManager.once('ticksChanged', () => {
              if (this.getStatus() === UniV4PoolWatcherStatus.Nothing)
                this.setStatus(UniV4PoolWatcherStatus.Something)
            })
          }
          this.wordLoadManager.once('isUpdated', () => {
            this.setStatus(UniV4PoolWatcherStatus.All)
            this.emit('isUpdated')
          })
          this.wordLoadManager.onPoolTickChange(this.state.tick, true)
          this.latestEventBlockNumber = blockNumber
          break
        }
      } catch (e) {
        Logger.error(this.client.chainId, `V4 Pool ${this.id} update failed`, e)
        this.setStatus(UniV4PoolWatcherStatus.Failed)
      }
      if (this.busyCounter) this.busyCounter.dec()
      this.updatePoolStateGuard = false
    }
  }

  processLog(l: Log): string {
    this.latestEventBlockNumber = Math.max(
      this.latestEventBlockNumber,
      Number(l.blockNumber || 0),
    )
    if (l.removed) {
      this.updatePoolState()
      return 'Removed'
    }

    if (l.blockNumber == null) return 'Error!'
    const data = decodeEventLog({
      abi: UniV4ChangeStateEventsAbi,
      data: l.data,
      topics: l.topics,
    })
    switch (data.eventName) {
      case 'Swap': {
        if (
          this.state !== undefined &&
          l.blockNumber > this.state.blockNumber
        ) {
          const { sqrtPriceX96, liquidity, tick } = data.args
          if (sqrtPriceX96 !== undefined) this.state.sqrtPriceX96 = sqrtPriceX96
          if (liquidity !== undefined) this.state.liquidity = liquidity
          if (tick !== undefined) {
            this.state.tick = Math.floor(tick / this.spacing) * this.spacing
            this.wordLoadManager.onPoolTickChange(this.state.tick, false)
          }
        }
        this._poolWasChanged()
        break
      }
      case 'ModifyPosition': {
        const { tickLower, tickUpper, liquidityDelta } = data.args
        if (
          tickLower !== undefined &&
          tickUpper !== undefined &&
          liquidityDelta
        ) {
          if (
            this.state !== undefined &&
            l.blockNumber > this.state.blockNumber
          ) {
            const tick = this.state.tick
            if (tickLower <= tick && tick < tickUpper)
              this.state.liquidity += liquidityDelta
          }
          this.wordLoadManager.addTick(l.blockNumber, tickLower, liquidityDelta)
          this.wordLoadManager.addTick(
            l.blockNumber,
            tickUpper,
            -liquidityDelta,
          )
        }
        this._poolWasChanged()
        break
      }
      default:
    }

    return data.eventName
  }

  getPoolCode(): PoolCode | undefined {
    if (this.lastPoolCode) return this.lastPoolCode
    if (this.state === undefined) return
    const ticks = this.wordLoadManager.getMaxTickDiapason(this.state.tick)
    if (ticks.length === 0) return

    const v3Pool = new UniV4Pool(
      this.id,
      this.token0 as RToken,
      this.token1 as RToken,
      this.fee / 1_000_000,
      this.state.tick,
      this.state.liquidity,
      this.state.sqrtPriceX96,
      ticks,
    )
    const pc = new UniV4PoolCode(
      this.address,
      v3Pool,
      this.provider,
      this.provider,
    )
    this.lastPoolCode = pc
    return pc
  }

  getTicks(): CLTick[] {
    if (this.state === undefined) return []
    return this.wordLoadManager.getMaxTickDiapason(this.state.tick)
  }

  isStable(): boolean {
    return (
      this.state !== undefined && !this.wordLoadManager.downloadCycleIsStared
    )
  }

  getStatus(): UniV4PoolWatcherStatus {
    return this.status
  }

  setStatus(status: UniV4PoolWatcherStatus) {
    if (status === this.status) return
    this.status = status
    if (
      status === UniV4PoolWatcherStatus.Failed &&
      this.downloadFinishedPromiseReject
    )
      this.downloadFinishedPromiseReject()
    if (
      status === UniV4PoolWatcherStatus.All &&
      this.downloadFinishedPromiseResolve
    )
      this.downloadFinishedPromiseResolve()
  }

  downloadFinishedPromise?: Promise<void>
  downloadFinishedPromiseResolve?: () => void
  downloadFinishedPromiseReject?: () => void
  async downloadFinished(): Promise<void> {
    if (this.status === UniV4PoolWatcherStatus.All) return Promise.resolve()
    if (this.status === UniV4PoolWatcherStatus.Failed) return Promise.reject()
    if (this.downloadFinishedPromise !== undefined)
      return this.downloadFinishedPromise
    this.downloadFinishedPromise = new Promise((resolve, reject) => {
      this.downloadFinishedPromiseResolve = resolve
      this.downloadFinishedPromiseReject = reject
    })
    await this.downloadFinishedPromise
    this.downloadFinishedPromise = undefined
    this.downloadFinishedPromiseResolve = undefined
    this.downloadFinishedPromiseReject = undefined
  }

  private _poolWasChanged() {
    if (this.lastPoolCode !== undefined) {
      this.lastPoolCode = undefined
      this.emit('PoolCodeWasChanged', this)
    }
  }

  debugState(): object {
    return {
      id: this.id,
      token0: `${this.token0.symbol} (${this.token0.id})`,
      token1: `${this.token1.symbol} (${this.token1.id})`,
      fee: this.fee,
      spacing: this.spacing,

      blockNumber: this.state?.blockNumber,
      tick: this.state?.tick,
      liquidity: this.state?.liquidity,
      sqrtPriceX96: this.state?.sqrtPriceX96,
      latestEventBlockNumber: this.latestEventBlockNumber,
      status: this.status,

      worlds: Array.from(this.wordLoadManager.words.entries()).map((w) => ({
        index: w[0],
        blockNumber: w[1].blockNumber,
        ticks: w[1].ticks.map((t) => [t.index, t.DLiquidity]),
      })),
    }
  }
}
