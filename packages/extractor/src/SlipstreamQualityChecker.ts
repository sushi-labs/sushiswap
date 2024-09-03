import { Log } from 'viem'
import { Logger } from './Logger.js'
import { SlipstreamV3PoolWatcher } from './SlipstreamV3PoolWatcher.js'
import { delay } from './Utils.js'

export enum AerodromeSlipstreamPoolSyncState {
  LiquidityMismatch = 'liquidity mismatch',
  PriceMismatch = 'price mismatch',
  CurrentTickMicmatch = 'tick mismatch',
  TicksStartMismatch = 'ticks start mismatch',
  TicksFinishMismatch = 'ticks finish mismatch',
  TicksMismatch = 'ticks mismatch',
  FeeMismatch = 'fee mismatsh',
  ReservesMismatch = 'reserves mismatch',
  Match = 'data 100% correct',
  CheckFailed = 'check failed',
}

export type AerodromeSlipstreamQualityCheckerCallBackArg = {
  ethalonPool: SlipstreamV3PoolWatcher
  correctPool?: SlipstreamV3PoolWatcher
  status: AerodromeSlipstreamPoolSyncState
}

export type AerodromeSlipstreamQualityCheckerCallBack = (
  arg: AerodromeSlipstreamQualityCheckerCallBackArg,
) => boolean

export class AerodromeSlipstreamQualityChecker {
  readonly checkAfterLogsNumber: number
  readonly callBack
  checkingPools: Map<string, SlipstreamV3PoolWatcher> = new Map()
  poolsLogCounter: Map<string, number> = new Map()
  totalCheckCounter = 0
  totalMatchCounter = 0

  constructor(
    checkAfterLogsNumber: number,
    callBack: AerodromeSlipstreamQualityCheckerCallBack,
  ) {
    this.checkAfterLogsNumber = checkAfterLogsNumber
    this.callBack = callBack
  }

  async check(
    pool: SlipstreamV3PoolWatcher,
    newPool: SlipstreamV3PoolWatcher,
  ): Promise<
    [
      SlipstreamV3PoolWatcher | undefined,
      AerodromeSlipstreamPoolSyncState,
      number,
      number,
    ]
  > {
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
            return [
              newPool,
              AerodromeSlipstreamPoolSyncState.LiquidityMismatch,
              1,
              0,
            ]
          if (pool.state.sqrtPriceX96 !== newPool.state.sqrtPriceX96)
            return [
              newPool,
              AerodromeSlipstreamPoolSyncState.PriceMismatch,
              1,
              0,
            ]
          if (pool.state.tick !== newPool.state.tick)
            return [
              newPool,
              AerodromeSlipstreamPoolSyncState.CurrentTickMicmatch,
              1,
              0,
            ]
          if (pool.state.fee !== newPool.state.fee)
            return [newPool, AerodromeSlipstreamPoolSyncState.FeeMismatch, 1, 0]
          const ticks0 = pool.getTicks()
          ticks0.shift()
          ticks0.pop()
          const ticks1 = newPool.getTicks()
          ticks1.shift()
          ticks1.pop()
          if (ticks1.length > 0) {
            const start = ticks0.findIndex((t) => t.index === ticks1[0].index)
            if (start === -1)
              return [
                newPool,
                AerodromeSlipstreamPoolSyncState.TicksStartMismatch,
                1,
                0,
              ]
            if (ticks0.length < start + ticks1.length)
              return [
                newPool,
                AerodromeSlipstreamPoolSyncState.TicksFinishMismatch,
                1,
                0,
              ]
            for (let i = 0; i < ticks1.length; ++i) {
              if (
                ticks0[i + start].index !== ticks1[i].index ||
                ticks0[i + start].DLiquidity !== ticks1[i].DLiquidity
              )
                return [
                  newPool,
                  AerodromeSlipstreamPoolSyncState.TicksMismatch,
                  1,
                  0,
                ]
            }
          }
          //this.totalMatchCounter++
          if (
            pool.state.reserve0 !== newPool.state.reserve0 ||
            pool.state.reserve1 !== newPool.state.reserve1
          )
            return [
              newPool,
              AerodromeSlipstreamPoolSyncState.ReservesMismatch,
              1,
              1,
            ]
          return [undefined, AerodromeSlipstreamPoolSyncState.Match, 1, 1]
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
    return [undefined, AerodromeSlipstreamPoolSyncState.CheckFailed, 0, 0]
  }

  processLog(l: Log, pool: SlipstreamV3PoolWatcher) {
    const addr = l.address.toLowerCase()
    const checkingPool = this.checkingPools.get(addr)
    if (checkingPool) checkingPool.processLog(l)
    else {
      const counter = this.poolsLogCounter.get(addr) || 0
      if (counter < this.checkAfterLogsNumber)
        this.poolsLogCounter.set(addr, counter + 1)
      else {
        const newPool = new SlipstreamV3PoolWatcher(
          pool.factory,
          pool.address,
          pool.tickHelperContract,
          pool.token0,
          pool.token1,
          pool.spacing,
          pool.client,
          pool.busyCounter,
        )
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
