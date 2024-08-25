import { Log } from 'viem'
import { Logger } from './Logger.js'
import { PoolSyncState } from './QualityChecker.js'
import { UniV4PoolWatcher } from './UniV4PoolWatcher.js'
import { delay } from './Utils.js'

export type UniV4QualityCheckerCallBackArg = {
  ethalonPool: UniV4PoolWatcher
  correctPool?: UniV4PoolWatcher
  status: PoolSyncState
}

export type UniV4QualityCheckerCallBack = (
  arg: UniV4QualityCheckerCallBackArg,
) => boolean

export class UniV4QualityChecker {
  readonly checkAfterLogsNumber: number
  readonly callBack
  checkingPools: Map<string, UniV4PoolWatcher> = new Map()
  poolsLogCounter: Map<string, number> = new Map()
  totalCheckCounter = 0
  totalMatchCounter = 0

  constructor(
    checkAfterLogsNumber: number,
    callBack: UniV4QualityCheckerCallBack,
  ) {
    this.checkAfterLogsNumber = checkAfterLogsNumber
    this.callBack = callBack
  }

  async check(
    pool: UniV4PoolWatcher,
    newPool: UniV4PoolWatcher,
  ): Promise<[UniV4PoolWatcher | undefined, PoolSyncState, number, number]> {
    try {
      await newPool.updatePoolState()
      for (let i = 0; i < 3600; ++i) {
        await delay(20000)
        if (
          newPool.isStable() &&
          pool.isStable() &&
          pool.state &&
          newPool.state &&
          pool.latestEventBlockNumber === newPool.latestEventBlockNumber &&
          pool.updatePoolStateGuard === false &&
          newPool.updatePoolStateGuard === false
        ) {
          //this.totalCheckCounter++
          if (pool.state.liquidity !== newPool.state.liquidity)
            return [newPool, PoolSyncState.LiquidityMismatch, 1, 0]
          if (pool.state.sqrtPriceX96 !== newPool.state.sqrtPriceX96)
            return [newPool, PoolSyncState.PriceMismatch, 1, 0]
          if (pool.state.tick !== newPool.state.tick)
            return [newPool, PoolSyncState.CurrentTickMicmatch, 1, 0]
          const ticks0 = pool.getTicks()
          ticks0.shift()
          ticks0.pop()
          const ticks1 = newPool.getTicks()
          ticks1.shift()
          ticks1.pop()
          if (ticks1.length > 0) {
            const start = ticks0.findIndex((t) => t.index === ticks1[0].index)
            if (start === -1)
              return [newPool, PoolSyncState.TicksStartMismatch, 1, 0]
            if (ticks0.length < start + ticks1.length)
              return [newPool, PoolSyncState.TicksFinishMismatch, 1, 0]
            for (let i = 0; i < ticks1.length; ++i) {
              if (
                ticks0[i + start].index !== ticks1[i].index ||
                ticks0[i + start].DLiquidity !== ticks1[i].DLiquidity
              )
                return [newPool, PoolSyncState.TicksMismatch, 1, 0]
            }
          }
          //this.totalMatchCounter++
          return [undefined, PoolSyncState.Match, 1, 1]
        }
      }
      Logger.error(
        pool.client.chainId,
        `Pool ${pool.address} quality check timeout error`,
      )
    } catch (e) {
      Logger.error(
        pool.client.chainId,
        `Pool ${pool.address} quality check error`,
        e,
      )
    }
    return [undefined, PoolSyncState.CheckFailed, 0, 0]
  }

  processLog(l: Log, pool: UniV4PoolWatcher) {
    const addr = l.address.toLowerCase()
    const checkingPool = this.checkingPools.get(addr)
    if (checkingPool) checkingPool.processLog(l)
    else {
      const counter = this.poolsLogCounter.get(addr) || 0
      if (counter < this.checkAfterLogsNumber)
        this.poolsLogCounter.set(addr, counter + 1)
      else {
        const newPool = new UniV4PoolWatcher({
          ...pool,
        })
        this.checkingPools.set(addr, newPool)
        this.check(pool, newPool).then((res) => {
          this.totalCheckCounter += res[2]
          this.totalMatchCounter += res[3]
          if (
            !this.callBack({
              ethalonPool: pool,
              correctPool: res[0],
              status: res[1],
            })
          ) {
            // return counters back
            this.totalCheckCounter -= res[2]
            this.totalMatchCounter -= res[3]
          }
          this.poolsLogCounter.set(addr, 0)
          this.checkingPools.delete(addr)
        })
      }
    }
  }
}
