import { EventEmitter } from 'node:events'

import { Address } from 'abitype'
import { tickLensAbi } from 'sushi/abi'
import { NUMBER_OF_SURROUNDING_TICKS } from 'sushi/router'
import { CLTick } from 'sushi/tines'

import { Counter } from './Counter'
import { MultiCallAggregator } from './MulticallAggregator'
import { warnLog } from './WarnLog'

interface WordState {
  blockNumber: number
  ticks: CLTick[]
}

// if positiveFirst == true returns 0, 1, -1, 2, -2, 3, -3, ...
// if positiveFirst == false returns 0, -1, 1, -2, 2, -3, 3, ...
function getJump(index: number, positiveFirst: boolean): number {
  let res
  if (index % 2 === 0) res = -index / 2
  else res = (index + 1) / 2
  return positiveFirst ? res : -res
}

export class WordLoadManager extends EventEmitter {
  poolAddress: Address
  poolSpacing: number
  tickHelperContract: Address
  client: MultiCallAggregator
  busyCounter?: Counter

  words: Map<number, WordState> = new Map()
  downloadQueue: number[] = []
  downloadCycleIsStared = false
  latestEventBlockNumber = 0

  constructor(
    poolAddress: Address,
    poolSpacing: number,
    tickHelperContract: Address,
    client: MultiCallAggregator,
    counter?: Counter
  ) {
    super()
    this.poolAddress = poolAddress
    this.poolSpacing = poolSpacing
    this.tickHelperContract = tickHelperContract
    this.client = client
    this.busyCounter = counter
  }

  wordIndex(tick: number) {
    return Math.floor(tick / this.poolSpacing / 256)
  }

  async startDownloadCycle() {
    if (!this.downloadCycleIsStared) {
      this.downloadCycleIsStared = true
      const initialQueueLength = this.downloadQueue.length
      if (initialQueueLength > 0 && this.busyCounter) this.busyCounter.inc()
      try {
        while (this.downloadQueue.length > 0) {
          const wordIndex = this.downloadQueue[this.downloadQueue.length - 1]
          const { blockNumber, returnValue: ticks } = await this.client.call<
            { tick: bigint; liquidityNet: bigint }[]
          >(this.tickHelperContract, tickLensAbi, 'getPopulatedTicksInWord', [
            this.poolAddress,
            wordIndex,
          ])
          const wordIndexNew = this.downloadQueue[this.downloadQueue.length - 1]
          if (wordIndexNew === wordIndex) {
            // Queue still has the same index at the end
            this.words.set(wordIndex, {
              blockNumber,
              ticks: ticks
                .map(({ tick, liquidityNet }) => ({
                  index: Number(tick),
                  DLiquidity: liquidityNet,
                }))
                .sort((a: CLTick, b: CLTick) => a.index - b.index),
            })
            this.emit('ticksChanged')
            if (blockNumber >= this.latestEventBlockNumber)
              this.downloadQueue.pop()
          }
        }
      } catch (_e) {
        warnLog(
          this.client.chainId,
          `Pool ${this.poolAddress} ticks downloading failed`,
        )
      }
      if (initialQueueLength > 0 && this.busyCounter) this.busyCounter.dec()
      this.emit('isUpdated')
      this.downloadCycleIsStared = false
    }
  }

  onPoolTickChange(tick: number, updateAll: boolean) {
    const currentTickWord = this.wordIndex(tick)
    const minWord = this.wordIndex(tick - NUMBER_OF_SURROUNDING_TICKS)
    const maxWord = this.wordIndex(tick + NUMBER_OF_SURROUNDING_TICKS)

    if (updateAll) {
      // the only case when inactual words are removed
      Array.from(this.words.keys()).forEach((index) => {
        if (index < minWord || index > maxWord) this.words.delete(index)
      })
    }

    const direction = currentTickWord - minWord <= maxWord - currentTickWord
    const wordNumber = maxWord - minWord
    const pendingWord: number | undefined =
      this.downloadQueue[this.downloadQueue.length - 1]
    const queue: number[] = []
    for (let i = wordNumber; i >= 0; --i) {
      const wordIndex = currentTickWord + getJump(i, direction)
      if (wordIndex === pendingWord) continue // will be set at the end
      const wordState = this.words.get(wordIndex)
      if (updateAll || wordState === undefined) queue.push(wordIndex)
    }
    if (pendingWord !== undefined) queue.push(pendingWord)
    this.downloadQueue = queue

    this.startDownloadCycle()
  }

  getMaxTickDiapason(tick: number): CLTick[] {
    const currentTickIndex = this.wordIndex(tick)
    if (!this.words.has(currentTickIndex)) return []
    let minIndex
    let maxIndex
    for (minIndex = currentTickIndex; this.words.has(minIndex); --minIndex);
    for (maxIndex = currentTickIndex + 1; this.words.has(maxIndex); ++maxIndex);
    if (maxIndex - minIndex <= 1) return []

    let ticks: CLTick[] = []
    for (let i = minIndex + 1; i < maxIndex; ++i)
      ticks = ticks.concat((this.words.get(i) as WordState).ticks)

    const lowerUnknownTick =
      (minIndex + 1) * this.poolSpacing * 256 - this.poolSpacing
    console.assert(
      ticks.length === 0 || lowerUnknownTick < ticks[0].index,
      'Error 85: unexpected min tick index',
    )
    ticks.unshift({
      index: lowerUnknownTick,
      DLiquidity: 0n,
    })
    const upperUnknownTick = maxIndex * this.poolSpacing * 256
    console.assert(
      ticks[ticks.length - 1].index < upperUnknownTick,
      'Error 91: unexpected max tick index',
    )
    ticks.push({
      index: upperUnknownTick,
      DLiquidity: 0n,
    })

    return ticks
  }

  hasSomeTicksAround(tick: number): boolean {
    return this.words.has(this.wordIndex(tick))
  }

  addTick(eventBlockNumber: bigint, tick: number, amount: bigint) {
    this.latestEventBlockNumber = Math.max(
      this.latestEventBlockNumber,
      Number(eventBlockNumber),
    )

    const tickWord = this.wordIndex(tick)
    const state = this.words.get(tickWord)
    if (state !== undefined) {
      const { blockNumber, ticks } = state

      if (eventBlockNumber <= blockNumber) return
      if (ticks.length === 0 || tick < ticks[0].index) {
        ticks.unshift({ index: tick, DLiquidity: amount })
        return
      }
      if (tick === ticks[0].index) {
        ticks[0].DLiquidity = ticks[0].DLiquidity + amount
        if (ticks[0].DLiquidity === 0n) ticks.splice(0, 1)
        return
      }

      let start = 0
      let end = ticks.length
      while (end - start > 1) {
        const middle = Math.floor((start + end) / 2)
        const index = ticks[middle].index
        if (index < tick) start = middle
        else if (index > tick) end = middle
        else {
          ticks[middle].DLiquidity = ticks[middle].DLiquidity + amount
          if (ticks[middle].DLiquidity === 0n) ticks.splice(middle, 1)
          return
        }
      }
      ticks.splice(start + 1, 0, { index: tick, DLiquidity: amount })
    }
  }
}
