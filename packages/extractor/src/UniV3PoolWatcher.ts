import { erc20Abi, tickLensAbi } from '@sushiswap/abi'
import { Token } from '@sushiswap/currency'
import { LiquidityProviders, NUMBER_OF_SURROUNDING_TICKS, PoolCode, UniV3PoolCode } from '@sushiswap/router'
import { CLTick, RToken, UniV3Pool } from '@sushiswap/tines'
import { FeeAmount, TICK_SPACINGS } from '@sushiswap/v3-sdk'
import { Abi, Address, parseAbiItem } from 'abitype'
import { BigNumber } from 'ethers'
import { decodeEventLog, Log } from 'viem'

import { EventManager } from './EventManager'
import { MultiCallAggregator } from './MulticallAggregator'

// if positiveFirst == true returns 0, 1, -1, 2, -2, 3, -3, ...
// if positiveFirst == false returns 0, -1, 1, -2, 2, -3, 3, ...
function getJump(index: number, positiveFirst: boolean): number {
  let res
  if (index % 2 == 0) res = -index / 2
  else res = (index + 1) / 2
  return positiveFirst ? res : -res
}

interface UniV3PoolSelfState {
  blockNumber: number
  reserve0: bigint
  reserve1: bigint
  tick: number
  liquidity: bigint
  sqrtPriceX96: bigint
}

interface WordState {
  blockNumber: number
  ticks: CLTick[]
}

const slot0Abi: Abi = [
  {
    inputs: [],
    name: 'slot0',
    outputs: [
      { internalType: 'uint160', name: 'sqrtPriceX96', type: 'uint160' },
      { internalType: 'int24', name: 'tick', type: 'int24' },
      { internalType: 'uint16', name: 'observationIndex', type: 'uint16' },
      { internalType: 'uint16', name: 'observationCardinality', type: 'uint16' },
      { internalType: 'uint16', name: 'observationCardinalityNext', type: 'uint16' },
      { internalType: 'uint8', name: 'feeProtocol', type: 'uint8' },
      { internalType: 'bool', name: 'unlocked', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const liquidityAbi: Abi = [
  {
    inputs: [],
    name: 'liquidity',
    outputs: [{ internalType: 'uint128', name: '', type: 'uint128' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const eventsAbi = [
  parseAbiItem(
    'event Mint(address sender, address indexed owner, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount, uint256 amount0, uint256 amount1)'
  ),
  parseAbiItem(
    'event Collect(address indexed owner, address recipient, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount0, uint128 amount1)'
  ),
  parseAbiItem(
    'event Burn(address indexed owner, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount, uint256 amount0, uint256 amount1)'
  ),
  parseAbiItem(
    'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)'
  ),
  parseAbiItem(
    'event Flash(address indexed sender, address indexed recipient, uint256 amount0, uint256 amount1, uint256 paid0, uint256 paid1)'
  ),
  parseAbiItem(
    'event CollectProtocol(address indexed sender, address indexed recipient, uint128 amount0, uint128 amount1)'
  ),
]

// TODO: more ticks and priority depending on resources
export class UniV3PoolWatcher {
  address: Address
  tickHelperContract: Address
  token0: Token
  token1: Token
  fee: FeeAmount
  spacing: number

  providerName: string
  client: MultiCallAggregator
  eventManager: EventManager

  updateIndex = 0
  eventFilter?: number

  state?: UniV3PoolSelfState
  wordList: Map<number, WordState> = new Map()

  constructor(
    providerName: string,
    address: Address,
    tickHelperContract: Address,
    token0: Token,
    token1: Token,
    fee: FeeAmount,
    client: MultiCallAggregator,
    eventManager: EventManager
  ) {
    this.providerName = providerName
    this.address = address
    this.tickHelperContract = tickHelperContract
    this.token0 = token0
    this.token1 = token1
    this.fee = fee
    this.spacing = TICK_SPACINGS[fee]

    this.client = client
    this.eventManager = eventManager
  }

  async stopWatching(restart = false) {
    if (restart && this.eventFilter) {
      await this.eventManager.stopEventListening(this.eventFilter)
      this.eventFilter = undefined
    }
    this.updateIndex++ // this should stop all currently awaited updates
  }

  async startWatching(stopPreviousEventFiltering = false) {
    await this.stopWatching(stopPreviousEventFiltering)

    const updateIndex = this.updateIndex
    if (this.eventFilter === undefined) {
      // TODO: still valnurable to several calls. Make it address only? With no index
      const eventFilter = await this.eventManager.startEventListening(this.processLog.bind(this), this.address)
      if (updateIndex !== this.updateIndex) return // After await check: Stop updating!
      this.eventFilter = eventFilter
    }

    const {
      blockNumber,
      returnValues: [slot0, liquidity, balance0, balance1],
    } = await this.client.callSameBlock([
      { address: this.address, abi: slot0Abi, functionName: 'slot0' },
      { address: this.address, abi: liquidityAbi, functionName: 'liquidity' },
      { address: this.token0.address as Address, abi: erc20Abi, functionName: 'balanceOf', args: [this.address] },
      { address: this.token1.address as Address, abi: erc20Abi, functionName: 'balanceOf', args: [this.address] },
    ])
    if (updateIndex !== this.updateIndex) return // After await check: Stop updating!

    const [sqrtPriceX96, tick] = slot0 as [bigint, number]
    this.state = {
      blockNumber,
      reserve0: balance0 as bigint,
      reserve1: balance1 as bigint,
      tick: Math.floor(tick / this.spacing) * this.spacing,
      liquidity: liquidity as bigint,
      sqrtPriceX96: sqrtPriceX96 as bigint,
    }

    const currentTickIndex = Math.floor(tick / this.spacing / 256)
    const minTick = Math.floor(tick - NUMBER_OF_SURROUNDING_TICKS / this.spacing / 256)
    const maxTick = Math.floor(tick + NUMBER_OF_SURROUNDING_TICKS / this.spacing / 256)
    const direction = currentTickIndex - minTick <= maxTick - currentTickIndex
    const wordNumber = maxTick - minTick
    for (let i = 0; i < wordNumber; ++i) {
      const wordIndex = currentTickIndex + getJump(i, direction)
      await this.startWatchWord(wordIndex)
      if (updateIndex !== this.updateIndex) return // After await check: Stop updating!
    }
  }

  async startWatchWord(wordIndex: number) {
    const updateIndex = this.updateIndex
    const { blockNumber, returnValue: ticks } = await this.client.call<{ tick: bigint; liquidityNet: bigint }[]>(
      this.tickHelperContract,
      tickLensAbi,
      'getPopulatedTicksInWord',
      [this.address, wordIndex]
    )
    if (updateIndex !== this.updateIndex) return // After await check: Stop updating!
    this.wordList.set(wordIndex, {
      blockNumber,
      ticks: ticks.map(({ tick, liquidityNet }) => ({
        index: Number(tick),
        DLiquidity: BigNumber.from(liquidityNet),
      })),
    })
  }

  updatePoolState() {
    // TODO: some words could appear to be not updated. Remove them?
    this.startWatching()
  }

  processLog(l: Log) {
    if (l.removed) {
      this.updatePoolState()
      return
    }
    if (l.blockNumber == null) return
    const data = decodeEventLog({ abi: eventsAbi, data: l.data, topics: l.topics })
    switch (data.eventName) {
      case 'Mint':
      case 'Burn': {
        let { amount, amount0, amount1 } = data.args
        if (data.eventName == 'Burn') {
          amount = amount === undefined ? undefined : -amount
          amount0 = amount0 === undefined ? undefined : -amount0
          amount1 = amount1 === undefined ? undefined : -amount1
        }
        const { tickLower, tickUpper } = data.args
        if (this.state !== undefined && l.blockNumber > this.state.blockNumber) {
          if (tickLower !== undefined && tickUpper !== undefined && amount) {
            const tick = this.state.tick
            if (tickLower <= tick && tick < tickUpper) this.state.liquidity += amount
          }
          if (amount1 !== undefined && amount0 !== undefined) {
            this.state.reserve0 += amount0
            this.state.reserve1 += amount1
          }
        }
        if (tickLower !== undefined && tickUpper !== undefined && amount) {
          this.addTick(l.blockNumber, tickLower, amount)
          this.addTick(l.blockNumber, tickUpper, -amount)
        }
        break
      }
      case 'Collect':
      case 'CollectProtocol': {
        if (this.state !== undefined && l.blockNumber > this.state.blockNumber) {
          const { amount0, amount1 } = data.args
          if (amount0 !== undefined && amount1 !== undefined) {
            this.state.reserve0 -= amount0
            this.state.reserve1 -= amount1
          }
        }
        break
      }
      case 'Flash': {
        if (this.state !== undefined && l.blockNumber > this.state.blockNumber) {
          const { paid0, paid1 } = data.args
          if (paid0 !== undefined && paid1 !== undefined) {
            this.state.reserve0 += paid0
            this.state.reserve1 += paid1
          }
        }
        break
      }
      case 'Swap': {
        if (this.state !== undefined && l.blockNumber > this.state.blockNumber) {
          const { amount0, amount1, sqrtPriceX96, liquidity, tick } = data.args
          if (amount0 !== undefined && amount1 !== undefined) {
            this.state.reserve0 -= amount0
            this.state.reserve1 -= amount1
          }
          if (sqrtPriceX96 !== undefined) this.state.sqrtPriceX96 = sqrtPriceX96
          if (liquidity !== undefined) this.state.liquidity = liquidity
          if (tick !== undefined) this.state.tick = Math.floor(tick / this.spacing) * this.spacing
          // TODO: new words watching
        }
        break
      }
      default:
    }
  }

  addTick(eventBlockNumber: bigint, tick: number, amount: bigint) {
    const tickWord = Math.floor(tick / this.spacing / 256)
    const state = this.wordList.get(tickWord)
    if (state !== undefined) {
      const { blockNumber, ticks } = state
      if (eventBlockNumber <= blockNumber) return
      if (ticks.length == 0 || tick < ticks[0].index) {
        ticks.unshift({ index: tick, DLiquidity: BigNumber.from(amount) })
        return
      }
      let start = 0,
        end = ticks.length
      while (end - start <= 1) {
        const middle = (start + end) / 2
        const index = ticks[middle].index
        if (index < tick) start = middle
        else if (index > tick) end = index
        else {
          ticks[middle].DLiquidity = ticks[middle].DLiquidity.add(amount)
          if (ticks[middle].DLiquidity.isZero()) ticks.splice(middle, 1)
          return
        }
      }
      ticks.splice(start + 1, 0, { index: tick, DLiquidity: BigNumber.from(amount) })
    }
  }

  getPoolCode(): PoolCode | undefined {
    if (this.state === undefined) return
    const currentTickIndex = Math.floor(this.state.tick / 256)
    if (!this.wordList.has(currentTickIndex)) return
    let minIndex, maxIndex
    for (minIndex = currentTickIndex; this.wordList.has(minIndex); --minIndex);
    for (maxIndex = currentTickIndex + 1; this.wordList.has(maxIndex); ++maxIndex);
    if (maxIndex - minIndex <= 1) return
    let ticks: CLTick[] = []
    for (let i = minIndex + 1; i < maxIndex; ++i) ticks = ticks.concat((this.wordList.get(i) as WordState).ticks)

    const lowerUnknownTick = minIndex * this.spacing * 256 - this.spacing
    console.assert(ticks.length == 0 || lowerUnknownTick < ticks[0].index, 'Error 165: unexpected min tick index')
    ticks.unshift({
      index: lowerUnknownTick,
      DLiquidity: BigNumber.from(0),
    })
    const upperUnknownTick = (maxIndex + 1) * this.spacing * 256
    console.assert(ticks[ticks.length - 1].index < upperUnknownTick, 'Error 169: unexpected max tick index')
    ticks.push({
      index: upperUnknownTick,
      DLiquidity: BigNumber.from(0),
    })

    const v3Pool = new UniV3Pool(
      this.address,
      this.token0 as RToken,
      this.token1 as RToken,
      this.fee / 1_000_000,
      BigNumber.from(this.state.reserve0),
      BigNumber.from(this.state.reserve1),
      this.state.tick,
      BigNumber.from(this.state.liquidity),
      BigNumber.from(this.state.sqrtPriceX96),
      ticks
    )

    const pc = new UniV3PoolCode(v3Pool, LiquidityProviders.UniswapV3, this.providerName)
    return pc
  }
}
