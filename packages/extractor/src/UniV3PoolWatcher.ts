import { EventEmitter } from 'node:events'
import { Abi, Address, parseAbiItem } from 'abitype'
import { erc20Abi_balanceOf } from 'sushi/abi'
import { Token } from 'sushi/currency'
import { LiquidityProviders, PoolCode, UniV3PoolCode } from 'sushi/router'
import { CLTick, RToken, UniV3Pool } from 'sushi/tines'
import { Log, decodeEventLog } from 'viem'
import { Counter } from './Counter.js'
import { Logger } from './Logger.js'
import { MultiCallAggregator } from './MulticallAggregator.js'
import { WordLoadManager } from './WordLoadManager.js'

interface UniV3PoolSelfState {
  blockNumber: number
  reserve0: bigint
  reserve1: bigint
  tick: number
  liquidity: bigint
  sqrtPriceX96: bigint
}

const slot0Abi: Abi = [
  {
    inputs: [],
    name: 'slot0',
    outputs: [
      { internalType: 'uint160', name: 'sqrtPriceX96', type: 'uint160' },
      { internalType: 'int24', name: 'tick', type: 'int24' },
      { internalType: 'uint16', name: 'observationIndex', type: 'uint16' },
      {
        internalType: 'uint16',
        name: 'observationCardinality',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'observationCardinalityNext',
        type: 'uint16',
      },
      { internalType: 'uint8', name: 'feeProtocol', type: 'uint8' },
      { internalType: 'bool', name: 'unlocked', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export const liquidityAbi: Abi = [
  {
    inputs: [],
    name: 'liquidity',
    outputs: [{ internalType: 'uint128', name: '', type: 'uint128' }],
    stateMutability: 'view',
    type: 'function',
  },
]

export const tickSpacingAbi: Abi = [
  {
    inputs: [],
    name: 'tickSpacing',
    outputs: [{ internalType: 'int24', name: '', type: 'int24' }],
    stateMutability: 'view',
    type: 'function',
  },
]

export const UniV3EventsAbi = [
  parseAbiItem(
    'event Mint(address sender, address indexed owner, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount, uint256 amount0, uint256 amount1)',
  ),
  parseAbiItem(
    'event Collect(address indexed owner, address recipient, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount0, uint128 amount1)',
  ),
  parseAbiItem(
    'event Burn(address indexed owner, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount, uint256 amount0, uint256 amount1)',
  ),
  parseAbiItem(
    'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)',
  ),
  parseAbiItem(
    // For Pancake
    'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick, uint128 protocolFeesToken0, uint128 protocolFeesToken1)',
  ),
  parseAbiItem(
    'event Flash(address indexed sender, address indexed recipient, uint256 amount0, uint256 amount1, uint256 paid0, uint256 paid1)',
  ),
  parseAbiItem(
    'event CollectProtocol(address indexed sender, address indexed recipient, uint128 amount0, uint128 amount1)',
  ),
]

export enum UniV3PoolWatcherStatus {
  Failed = 'Failed',
  Nothing = 'Nothing',
  Something = 'Something',
  All = 'All',
}

// TODO: more ticks and priority depending on resources
// TODO: gather statistics how often (blockNumber < this.latestEventBlockNumber)
// event PoolCodeWasChanged is emitted each time getPoolCode() returns another pool (lastPoolCode changed)
export class UniV3PoolWatcher extends EventEmitter {
  address: Address
  tickHelperContract: Address
  token0: Token
  token1: Token
  fee: number
  spacing: number
  latestEventBlockNumber = 0

  provider: LiquidityProviders
  client: MultiCallAggregator
  wordLoadManager: WordLoadManager
  state?: UniV3PoolSelfState
  updatePoolStateGuard = false
  busyCounter?: Counter
  private lastPoolCode?: PoolCode
  status: UniV3PoolWatcherStatus = UniV3PoolWatcherStatus.Nothing

  constructor(
    provider: LiquidityProviders,
    address: Address,
    tickHelperContract: Address,
    token0: Token,
    token1: Token,
    fee: number,
    spacing: number,
    client: MultiCallAggregator,
    busyCounter?: Counter,
  ) {
    super()
    this.provider = provider
    this.address = address
    this.tickHelperContract = tickHelperContract
    this.token0 = token0
    this.token1 = token1
    this.fee = fee
    this.spacing = spacing

    this.client = client
    this.wordLoadManager = new WordLoadManager(
      address,
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
            returnValues: [slot0, tickSpacing, liquidity, balance0, balance1],
          } = await this.client.callSameBlock([
            { address: this.address, abi: slot0Abi, functionName: 'slot0' },
            {
              address: this.address,
              abi: tickSpacingAbi,
              functionName: 'tickSpacing',
            },
            {
              address: this.address,
              abi: liquidityAbi,
              functionName: 'liquidity',
            },
            {
              address: this.token0.address as Address,
              abi: erc20Abi_balanceOf,
              functionName: 'balanceOf',
              args: [this.address],
            },
            {
              address: this.token1.address as Address,
              abi: erc20Abi_balanceOf,
              functionName: 'balanceOf',
              args: [this.address],
            },
          ])
          if (blockNumber < this.latestEventBlockNumber) continue // later events already have came

          if (tickSpacing !== this.spacing)
            Logger.error(
              this.client.chainId,
              `Wrong spacing. Expected: ${this.spacing}, real: ${tickSpacing}, pool: ${this.address}`,
            )

          const [sqrtPriceX96, tick] = slot0 as [bigint, number]
          this.state = {
            blockNumber,
            reserve0: balance0 as bigint,
            reserve1: balance1 as bigint,
            tick: Math.floor(tick / this.spacing) * this.spacing,
            liquidity: liquidity as bigint,
            sqrtPriceX96: sqrtPriceX96 as bigint,
          }
          this._poolWasChanged()

          if (this.getStatus() === UniV3PoolWatcherStatus.Nothing) {
            this.wordLoadManager.once('ticksChanged', () => {
              if (this.getStatus() === UniV3PoolWatcherStatus.Nothing)
                this.setStatus(UniV3PoolWatcherStatus.Something)
            })
          }
          this.wordLoadManager.once('isUpdated', () => {
            this.setStatus(UniV3PoolWatcherStatus.All)
            this.emit('isUpdated')
          })
          this.wordLoadManager.onPoolTickChange(this.state.tick, true)
          this.latestEventBlockNumber = blockNumber
          break
        }
      } catch (e) {
        Logger.error(
          this.client.chainId,
          `V3 Pool ${this.address} update failed`,
          e,
        )
        this.setStatus(UniV3PoolWatcherStatus.Failed)
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
      abi: UniV3EventsAbi,
      data: l.data,
      topics: l.topics,
    })
    switch (data.eventName) {
      case 'Mint': {
        const { amount, amount0, amount1 } = data.args
        const { tickLower, tickUpper } = data.args
        if (
          this.state !== undefined &&
          l.blockNumber > this.state.blockNumber
        ) {
          if (tickLower !== undefined && tickUpper !== undefined && amount) {
            const tick = this.state.tick
            if (tickLower <= tick && tick < tickUpper)
              this.state.liquidity += amount
          }
          if (amount1 !== undefined && amount0 !== undefined) {
            this.state.reserve0 += amount0
            this.state.reserve1 += amount1
          }
        }
        if (tickLower !== undefined && tickUpper !== undefined && amount) {
          this.wordLoadManager.addTick(l.blockNumber, tickLower, amount)
          this.wordLoadManager.addTick(l.blockNumber, tickUpper, -amount)
        }
        this._poolWasChanged()
        break
      }
      case 'Burn': {
        const { amount } = data.args
        const { tickLower, tickUpper } = data.args
        if (
          this.state !== undefined &&
          l.blockNumber > this.state.blockNumber
        ) {
          if (tickLower !== undefined && tickUpper !== undefined && amount) {
            const tick = this.state.tick
            if (tickLower <= tick && tick < tickUpper)
              this.state.liquidity -= amount
          }
        }
        if (tickLower !== undefined && tickUpper !== undefined && amount) {
          this.wordLoadManager.addTick(l.blockNumber, tickLower, -amount)
          this.wordLoadManager.addTick(l.blockNumber, tickUpper, amount)
        }
        this._poolWasChanged()
        break
      }
      case 'Collect':
      case 'CollectProtocol': {
        if (
          this.state !== undefined &&
          l.blockNumber > this.state.blockNumber
        ) {
          const { amount0, amount1 } = data.args
          if (amount0 !== undefined && amount1 !== undefined) {
            this.state.reserve0 -= amount0
            this.state.reserve1 -= amount1
          }
        }
        this._poolWasChanged()
        break
      }
      case 'Flash': {
        if (
          this.state !== undefined &&
          l.blockNumber > this.state.blockNumber
        ) {
          const { paid0, paid1 } = data.args
          if (paid0 !== undefined && paid1 !== undefined) {
            this.state.reserve0 += paid0
            this.state.reserve1 += paid1
          }
        }
        this._poolWasChanged()
        break
      }
      case 'Swap': {
        if (
          this.state !== undefined &&
          l.blockNumber > this.state.blockNumber
        ) {
          const { amount0, amount1, sqrtPriceX96, liquidity, tick } = data.args
          if (amount0 !== undefined && amount1 !== undefined) {
            this.state.reserve0 += amount0
            this.state.reserve1 += amount1
          }
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
      default:
    }

    return data.eventName
  }

  getPoolCode(): PoolCode | undefined {
    if (this.lastPoolCode) return this.lastPoolCode
    if (this.state === undefined) return
    const ticks = this.wordLoadManager.getMaxTickDiapason(this.state.tick)
    if (ticks.length === 0) return

    const v3Pool = new UniV3Pool(
      this.address,
      this.token0 as RToken,
      this.token1 as RToken,
      this.fee / 1_000_000,
      this.state.reserve0,
      this.state.reserve1,
      this.state.tick,
      this.state.liquidity,
      this.state.sqrtPriceX96,
      ticks,
    )
    const pc = new UniV3PoolCode(v3Pool, this.provider, this.provider)
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

  getStatus(): UniV3PoolWatcherStatus {
    return this.status
  }

  setStatus(status: UniV3PoolWatcherStatus) {
    if (status === this.status) return
    this.status = status
    if (
      status === UniV3PoolWatcherStatus.Failed &&
      this.downloadFinishedPromiseReject
    )
      this.downloadFinishedPromiseReject()
    if (
      status === UniV3PoolWatcherStatus.All &&
      this.downloadFinishedPromiseResolve
    )
      this.downloadFinishedPromiseResolve()
  }

  downloadFinishedPromise?: Promise<void>
  downloadFinishedPromiseResolve?: () => void
  downloadFinishedPromiseReject?: () => void
  async downloadFinished(): Promise<void> {
    if (this.status === UniV3PoolWatcherStatus.All) return Promise.resolve()
    if (this.status === UniV3PoolWatcherStatus.Failed) return Promise.reject()
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
      address: this.address,
      token0: `${this.token0.symbol} (${this.token0.address})`,
      token1: `${this.token1.symbol} (${this.token1.address})`,
      fee: this.fee,
      spacing: this.spacing,

      blockNumber: this.state?.blockNumber,
      reserve0: this.state?.reserve0,
      reserve1: this.state?.reserve1,
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
